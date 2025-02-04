import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Facebook,
  Twitter,
  Linkedin,
  Calendar,
  FileText,
  Eye,
  BookOpen,
  Heart,
  Share2,
  Mail,
  X,
} from "lucide-react";
import Layout from "../Layout";
import { useWorks } from "@/context/WorkContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { formatTime } from "@/lib/formatTime";
import { useUser } from "@/context/UserContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import Comments from "@/components/works/Comments";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export default function SingleWorkPage() {
  const [relatedWorks, setRelatedWorks] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const { incrementViewCount, getWorkById, getAllWorks, work, works } =
    useWorks();
  const { userProfile } = useUser();

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    getWorkById(slug);

    const timer = setTimeout(() => {
      incrementViewCount(slug);
    }, 1000);
    return () => clearTimeout(timer);
  }, [slug, getWorkById, incrementViewCount]);

  useEffect(() => {
    const fetchRelatedWorks = async () => {
      if (!works || works.length === 0) {
        await getAllWorks();
      }

      if (work && works && works.length > 0) {
        const related = works
          .filter((w) => w.id !== work.id)
          .sort((a, b) => {
            const aRelevance = getRelevanceScore(a, work);
            const bRelevance = getRelevanceScore(b, work);
            return bRelevance - aRelevance;
          })
          .slice(0, 3);

        setRelatedWorks(related);
      }
    };

    fetchRelatedWorks();
  }, [work, works, getAllWorks]);

  const getRelevanceScore = (workA, workB) => {
    let score = 0;
    if (workA.genre === workB.genre) score += 2;
    if (workA.completionStatus === workB.completionStatus) score += 1;
    return score;
  };

  const shareOnSocialMedia = (platform) => {
    const url = window.location.href;
    const text = `Check out this work: ${work?.title}`;

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(text)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
            url
          )}&title=${encodeURIComponent(work?.title)}`,
          "_blank"
        );
        break;
      case "email":
        window.open(
          `mailto:?subject=${encodeURIComponent(
            work?.title
          )}&body=${encodeURIComponent(text + "\n\n" + url)}`,
          "_blank"
        );
        break;
      default:
        console.error("Unsupported platform");
    }
  };

  return (
    <Layout>
      <div className="pb-12">
        <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
          <Image
            src={work?.coverImage}
            alt={work?.title}
            layout="fill"
            objectFit="cover"
            className="absolute top-0 left-0 w-full h-full opacity-40 dark:opacity-30 blur-sm scale-105 dark:saturate-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background/50"></div>
          <div className="container mx-auto px-4 py-12 pt-28 relative z-10">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
              <div className="relative h-96 lg:h-120 aspect-[0.7] shrink-0">
                {work?.coverImage ? (
                  <Image
                    src={work?.coverImage}
                    alt={work?.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg shadow-2xl"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-400 dark:bg-neutral-800 rounded-lg shadow-2xl animate-pulse"></div>
                )}
              </div>
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left max-w-2xl">
                {work?.title ? (
                  <h1 className="text-3xl lg:text-4xl font-semibold mb-4 leading-tight">
                    {work.title}
                  </h1>
                ) : (
                  <div className="h-9 w-full bg-gray-400 dark:bg-neutral-800 rounded mb-4 animate-pulse"></div>
                )}
                <p className="text-lg font-medium text-primary mb-6">
                  by Violet Clough
                </p>
                {work?.synopsis ? (
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8">
                    {work.synopsis}
                  </p>
                ) : (
                  <div className="h-20 w-full bg-gray-400 dark:bg-neutral-800 rounded mb-8 animate-pulse"></div>
                )}
                <div className="flex flex-wrap justify-center lg:justify-start items-center gap-8 mb-8 w-full">
                  {work?.datePublished && (
                    <div className="flex flex-col items-center sm:items-start">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        <span className="font-medium">
                          {work?.datePublished}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-primary" />
                      <span className="font-medium">
                        {work?.content
                          ? work.content
                              .replace(/<p>/g, " ")
                              .replace(/<\/p>/g, " ")
                              .replace(/<[^>]+>/g, "")
                              .trim()
                              .split(/\s+/)
                              .filter((word) => word.length > 0).length
                          : 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center sm:items-start">
                    <div className="flex items-center">
                      <Eye className="w-4 h-4 mr-2 text-primary" />
                      <span className="font-medium">
                        {work?.viewCount || 0}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-8">
                  {work?.tags?.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2"
                    onClick={() => setShowShareModal(true)}
                  >
                    <Share2 className="w-5 h-5" />
                    Share
                  </Button>
                </div>

                <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
                  <DialogContent>
                    <DialogHeader className="flex flex-col items-center text-center">
                      <Image
                        src={work?.coverImage}
                        alt={work?.title}
                        width={100}
                        height={100}
                        className="rounded-lg mb-4"
                      />
                      <DialogTitle className="text-2xl font-semibold mb-2">
                        Share with your friends!
                      </DialogTitle>
                      <DialogDescription>
                        Spread the word about &quot;{work?.title}&quot;.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col space-y-4">
                      <Button
                        variant="outline"
                        onClick={() => shareOnSocialMedia("facebook")}
                        className="w-full justify-start"
                      >
                        <Facebook className="mr-2 h-4 w-4" /> Share on Facebook
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => shareOnSocialMedia("twitter")}
                        className="w-full justify-start"
                      >
                        <Twitter className="mr-2 h-4 w-4" /> Share on Twitter
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => shareOnSocialMedia("linkedin")}
                        className="w-full justify-start"
                      >
                        <Linkedin className="mr-2 h-4 w-4" /> Share on LinkedIn
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => shareOnSocialMedia("email")}
                        className="w-full justify-start"
                      >
                        <Mail className="mr-2 h-4 w-4" /> Share via Email
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="px-8 max-sm:px-4 mt-12">
          <div className="mb-8">
            <div className="content-styles mb-8">
              <div dangerouslySetInnerHTML={{ __html: work?.content }} />
            </div>
            <Separator />
            {/* Author */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Scribe</h2>
              <div className="flex items-center">
                <Avatar className="h-12 w-12 mr-4">
                  <AvatarImage src={userProfile?.avatarUrl} alt={"VC"} />
                  <AvatarFallback>VC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">Violet Clough</p>
                </div>
              </div>
            </div>
          </div>

          {/* Share */}
          <Card className="mb-12">
            <h2 className="text-xl font-semibold mb-4">Share with others</h2>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => shareOnSocialMedia("facebook")}
              >
                <Facebook className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => shareOnSocialMedia("twitter")}
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => shareOnSocialMedia("linkedin")}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        </div>
        <section className="grid grid-cols-3 max-md:grid-cols-1 px-8 gap-8 max-sm:px-4">
          {/* Comments */}
          <div className="md:col-span-2 max-md:order-2">
            <Comments workId={slug} />
          </div>
          {/* Related Works */}
          {relatedWorks && relatedWorks.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-6">Related Works</h2>
              <div className="grid grid-cols-1 gap-4">
                {relatedWorks?.map((relatedWork) => (
                  <Link href={`/works/${relatedWork.id}`} key={relatedWork.id}>
                    <Card className="flex items-center hover:bg-muted p-4">
                      <Image
                        src={relatedWork.coverImage}
                        alt={relatedWork.title}
                        width={100}
                        height={150}
                        className="rounded mr-4"
                      />
                      <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-bold mb-1">
                          {relatedWork.title}
                        </h3>
                        <p className="flex items-center gap-2 text-sm mb-1 font-medium">
                          <FileText className="w-4 h-4" />
                          <span className="font-medium">
                            {relatedWork.content
                              ? relatedWork.content
                                  .replace(/<p>/g, " ")
                                  .replace(/<\/p>/g, " ")
                                  .replace(/<[^>]+>/g, "")
                                  .trim()
                                  .split(/\s+/)
                                  .filter((word) => word.length > 0).length
                              : 0}
                          </span>
                        </p>
                        {/* <p className="flex items-center gap-2 text-sm mb-1">
                          <Calendar className="h-4 w-4" />
                          {relatedWork?.datePublished}
                        </p> */}
                        <p className="flex items-center gap-2 text-sm mb-1">
                          <p className="line-clamp-2">Synopsis: {relatedWork?.synopsis}</p>
                        </p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
}
