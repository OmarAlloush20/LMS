import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VideoPlayer from "@/components/video-player";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  getCurrentCourseProgressService,
  markLectureAsViewedService,
  resetCourseProgressService,
} from "@/services";
import { Check, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";

function StudentViewCourseProgressPage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } =
    useContext(StudentContext);
  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialog, setShowCourseCompleteDialog] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(true);
  const { id } = useParams();

  async function fetchCurrentCourseProgress() {
    const response = await getCurrentCourseProgressService(auth?.user?._id, id);
    if (response?.success) {
      if (!response?.data?.isPurchased) {
        setLockCourse(true);
      } else {
        setStudentCurrentCourseProgress({
          courseDetails: response?.data?.courseDetails,
          progress: response?.data?.progress,
        });

        if (response?.data?.completed) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
          setShowCourseCompleteDialog(true);
          setShowConfetti(true);

          return;
        }

        if (response?.data?.progress?.length === 0) {
          setCurrentLecture(response?.data?.courseDetails?.curriculum[0]);
        } else {
          console.log("logging here");
          const lastIndexOfViewedAsTrue = response?.data?.progress.reduceRight(
            (acc, obj, index) => {
              return acc === -1 && obj.viewed ? index : acc;
            },
            -1
          );

          setCurrentLecture(
            response?.data?.courseDetails?.curriculum[
              lastIndexOfViewedAsTrue + 1
            ]
          );
        }
      }
    }
  }

  async function updateCourseProgress() {
    if (currentLecture) {
      const response = await markLectureAsViewedService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id,
        currentLecture._id
      );

      if (response?.success) {
        fetchCurrentCourseProgress();
      }
    }
  }

  async function handleRewatchCourse() {
    const response = await resetCourseProgressService(
      auth?.user?._id,
      studentCurrentCourseProgress?.courseDetails?._id
    );

    if (response?.success) {
      setCurrentLecture(null);
      setShowConfetti(false);
      setShowCourseCompleteDialog(false);
      fetchCurrentCourseProgress();
    }
  }

  const handleLectureClick = (lecture) => {
    setCurrentLecture(lecture);
  };

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [id]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) updateCourseProgress();
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 15000);
  }, [showConfetti]);

  console.log(currentLecture, "currentLecture");

  return (
    <div className="flex flex-col h-screen bg-slate-900 text-gray-100">
      {showConfetti && <Confetti />}
      <div className="flex items-center justify-between px-6 py-3 bg-indigo-900 border-b border-indigo-700 shadow-md">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student-courses")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Courses
          </Button>
          <h1 className="text-lg font-bold hidden md:block text-gray-100">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>
        <Button
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div
          className={`flex-1 ${
            isSideBarOpen ? "mr-[400px]" : ""
          } transition-all duration-300`}
        >
          <VideoPlayer
            width="100%"
            height="500px"
            url={currentLecture?.videoUrl}
            onProgressUpdate={setCurrentLecture}
            progressData={currentLecture}
          />
          <div className="p-6 bg-slate-800">
            <h2 className="text-2xl font-bold mb-2 text-gray-100">
              {currentLecture?.title}
            </h2>
          </div>
        </div>
        <div
          className={`fixed top-[57px] right-0 bottom-0 w-[400px] bg-slate-800 border-l border-slate-700 transition-all duration-300 shadow-lg ${
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid bg-slate-900 w-full grid-cols-2 p-0 h-12">
              <TabsTrigger
                value="content"
                className="rounded-none h-full bg-transparent data-[state=active]:bg-indigo-700 data-[state=active]:text-white text-gray-300"
              >
                Course Content
              </TabsTrigger>
              <TabsTrigger
                value="overview"
                className="rounded-none h-full bg-transparent data-[state=active]:bg-indigo-700 data-[state=active]:text-white text-gray-300"
              >
                Overview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="m-0 p-0">
              <ScrollArea className="h-full">
                <div className="p-2 space-y-2">
                  {studentCurrentCourseProgress?.courseDetails?.curriculum.map(
                    (item) => (
                      <div
                        className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium cursor-pointer rounded-md hover:bg-slate-700 transition-colors ${
                          currentLecture?._id === item._id
                            ? "bg-slate-700 border-l-4 border-indigo-500 pl-3"
                            : ""
                        }`}
                        key={item._id}
                        onClick={() => handleLectureClick(item)}
                      >
                        {studentCurrentCourseProgress?.progress?.find(
                          (progressItem) => progressItem.lectureId === item._id
                        )?.viewed ? (
                          <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Play className="h-4 w-4 text-indigo-400 flex-shrink-0" />
                        )}
                        <span className="line-clamp-2">{item?.title}</span>
                      </div>
                    )
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent
              value="overview"
              className="flex-1 overflow-hidden m-0 p-0"
            >
              <ScrollArea className="h-full">
                <div className="px-6 py-4">
                  <h2 className="text-xl font-bold mb-4 text-indigo-300">
                    About this course
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    {studentCurrentCourseProgress?.courseDetails?.description}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Dialog open={lockCourse}>
        <DialogContent className="sm:w-[425px] bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-indigo-300">
              Access Restricted
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Please purchase this course to gain access to the content.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end mt-4">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
              Go to Purchase
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={showCourseCompleteDialog}>
        <DialogContent
          showOverlay={false}
          className="sm:w-[425px] bg-slate-800 text-white border-slate-700"
        >
          <DialogHeader>
            <DialogTitle className="text-emerald-400 text-xl">
              Congratulations!
            </DialogTitle>
            <DialogDescription className="flex flex-col gap-3 text-gray-300">
              <Label className="text-lg">
                You have successfully completed the course
              </Label>
              <div className="flex flex-row gap-3 mt-2">
                <Button
                  onClick={() => navigate("/student-courses")}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  My Courses Page
                </Button>
                <Button
                  onClick={handleRewatchCourse}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Rewatch Course
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentViewCourseProgressPage;
