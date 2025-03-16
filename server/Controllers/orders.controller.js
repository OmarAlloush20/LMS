import stripe from "../Helpers/stripe.js";
import Order from "../Models/Order.js";
import Course from "../Models/Course.js";
import StudentCourses from "../Models/StudentCourses.js";

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod,
      paymentStatus,
      orderDate,
      paymentId,
      payerId,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    } = req.body;

    // Create a new order record
    const newlyCreatedCourseOrder = new Order({
      userId,
      userName,
      userEmail,
      orderStatus,
      paymentMethod: "stripe", // Changed from paypal to stripe
      paymentStatus,
      orderDate,
      paymentId,
      payerId,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing,
    });

    await newlyCreatedCourseOrder.save();

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: courseTitle,
              description: courseTitle,
              images: [courseImage], // Optional: Include course image if available
            },
            unit_amount: Math.round(coursePricing * 100), // Stripe expects amounts in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-return?session_id={CHECKOUT_SESSION_ID}&order_id=${newlyCreatedCourseOrder._id}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
      metadata: {
        orderId: newlyCreatedCourseOrder._id.toString(),
      },
    });

    res.status(201).json({
      success: true,
      data: {
        sessionId: session.id,
        checkoutUrl: session.url,
        orderId: newlyCreatedCourseOrder._id,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const capturePaymentAndFinalizeOrder = async (req, res) => {
  try {
    const { sessionId, orderId } = req.body;

    // Verify the payment was successful using Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order cannot be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = session.payment_intent;
    order.payerId = session.customer; // Stripe doesn't have a direct equivalent to PayerID

    await order.save();

    // Update student course model
    const studentCourses = await StudentCourses.findOne({
      userId: order.userId,
    });

    if (studentCourses) {
      studentCourses.courses.push({
        courseId: order.courseId,
        title: order.courseTitle,
        instructorId: order.instructorId,
        instructorName: order.instructorName,
        dateOfPurchase: order.orderDate,
        courseImage: order.courseImage,
      });

      await studentCourses.save();
    } else {
      const newStudentCourses = new StudentCourses({
        userId: order.userId,
        courses: [
          {
            courseId: order.courseId,
            title: order.courseTitle,
            instructorId: order.instructorId,
            instructorName: order.instructorName,
            dateOfPurchase: order.orderDate,
            courseImage: order.courseImage,
          },
        ],
      });

      await newStudentCourses.save();
    }

    // Update the course schema students
    await Course.findByIdAndUpdate(order.courseId, {
      $addToSet: {
        students: {
          studentId: order.userId,
          studentName: order.userName,
          studentEmail: order.userEmail,
          paidAmount: order.coursePricing,
        },
      },
    });

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

// Optional: Webhook handler for Stripe events
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata.orderId;

    // Process the order completion here if you prefer to use webhooks
    // This is an alternative to the client-side redirect method
    try {
      let order = await Order.findById(orderId);

      if (order && order.paymentStatus !== "paid") {
        order.paymentStatus = "paid";
        order.orderStatus = "confirmed";
        order.paymentId = session.payment_intent;

        await order.save();

        // Update student courses and course students as in capturePaymentAndFinalizeOrder
        // ...
      }
    } catch (error) {
      console.log("Error processing webhook:", error);
    }
  }

  res.status(200).json({ received: true });
};

export { createOrder, capturePaymentAndFinalizeOrder, handleStripeWebhook };
