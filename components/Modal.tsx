"use client";

import {
  CheckIcon,
  PlusIcon,
  HandThumbUpIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import MuiModal from "@mui/material/Modal";
import {
  collection,
  deleteDoc,
  doc,
  DocumentData,
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { getDb } from "../firebase";
import useAuth from "../hooks/useAuth";
import { Genre, Movie } from "../typings";
import { useUiStore } from "../stores/uiStore";

type TmdbVideo = {
  site?: string;
  type?: string;
  key?: string;
  name?: string;
};

export default function Modal() {
  const showModal = useUiStore((s) => s.showModal);
  const movie = useUiStore((s) => s.currentMovie);
  const autoplayTrailer = useUiStore((s) => s.autoplayTrailer);
  const closeModal = useUiStore((s) => s.closeModal);
  const setAutoplayTrailer = useUiStore((s) => s.setAutoplayTrailer);

  const [trailer, setTrailer] = useState<string>("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeErrored, setIframeErrored] = useState(false);

  const movieKey = useMemo(() => {
    return movie?.id ? String(movie.id) : "none";
  }, [movie?.id]);

  const { user } = useAuth();
  const [movies, setMovies] = useState<DocumentData[] | Movie[]>([]);

  const toastStyle = {
    background: "white",
    color: "black",
    fontWeight: "bold",
    fontSize: "16px",
    padding: "15px",
    borderRadius: "9999px",
    maxWidth: "1000px",
  };

  useEffect(() => {
    if (!movie) return;

    async function fetchMovie() {
      setPlayerError(null);
      setIframeLoaded(false);
      setIframeErrored(false);

      const data = await fetch(
        `https://api.themoviedb.org/3/${
          movie?.media_type === "tv" ? "tv" : "movie"
        }/${movie?.id}?api_key=${
          process.env.NEXT_PUBLIC_API_KEY
        }&language=en-US&append_to_response=videos`
      )
        .then((response) => response.json())
        .catch((err) => {
          console.log(err?.message ?? err);
          return null;
        });

      const resultsRaw = data?.videos?.results;
      if (Array.isArray(resultsRaw) && resultsRaw.length > 0) {
        const results = resultsRaw as unknown as TmdbVideo[];

        const pick =
          results.find((v) => v.site === "YouTube" && v.type === "Trailer") ??
          results.find((v) => v.site === "YouTube" && v.type === "Teaser") ??
          results.find((v) => v.site === "YouTube" && v.type === "Clip") ??
          results.find(
            (v) => v.site === "YouTube" && v.type === "Featurette"
          ) ??
          results.find((v) => v.site === "YouTube") ??
          null;

        const key = typeof pick?.key === "string" ? pick.key : "";

        if (process.env.NODE_ENV !== "production") {
          console.log("[Modal videos]", {
            id: movie?.id,
            media: movie?.media_type,
            picked: pick
              ? {
                  site: pick.site,
                  type: pick.type,
                  key: pick.key,
                  name: pick.name,
                }
              : null,
            total: results.length,
          });
        }

        setTrailer(key);
        if (key) setAutoplayTrailer(true);
      } else {
        setTrailer("");
      }

      if (data?.genres) setGenres(data.genres);
      else setGenres([]);
    }

    fetchMovie();
  }, [movie, movieKey, setAutoplayTrailer]);

  useEffect(() => {
    const db = getDb();
    if (!db || !user) return;

    return onSnapshot(
      collection(db, "customers", user.uid, "myList"),
      (snapshot) => setMovies(snapshot.docs)
    );
  }, [user?.uid, user]);

  const addedToList =
    !!movie?.id &&
    movies.findIndex((result: DocumentData | Movie) => {
      if (typeof (result as DocumentData).data === "function") {
        return (result as DocumentData).data().id === movie.id;
      }
      return (result as Movie).id === movie.id;
    }) !== -1;

  const isPlaying = autoplayTrailer && !!trailer;

  const youtubeEmbedUrl = useMemo(() => {
    if (!trailer) return "";

    const params = new URLSearchParams({
      autoplay: isPlaying ? "1" : "0",
      mute: isPlaying ? "1" : "0",
      controls: "1",
      rel: "0",
      modestbranding: "1",
      playsinline: "1",
      enablejsapi: "1",
      origin: typeof window !== "undefined" ? window.location.origin : "",
    });

    return `https://www.youtube-nocookie.com/embed/${trailer}?${params.toString()}`;
  }, [isPlaying, trailer]);

  const handleList = async () => {
    if (!user) {
      toast("Please sign in to use My List", {
        duration: 4000,
        style: toastStyle,
      });
      return;
    }

    const db = getDb();
    if (!db) {
      toast("Database not ready yet. Please refresh.", {
        duration: 4000,
        style: toastStyle,
      });
      return;
    }

    if (!movie?.id) return;

    const docRef = doc(
      db,
      "customers",
      user.uid,
      "myList",
      movie.id.toString()
    );

    if (addedToList) {
      await deleteDoc(docRef);
      toast(
        `${movie?.title || movie?.original_name} has been removed from My List`,
        {
          duration: 8000,
          style: toastStyle,
        }
      );
    } else {
      await setDoc(docRef, { ...movie });
      toast(
        `${movie?.title || movie?.original_name} has been added to My List`,
        {
          duration: 8000,
          style: toastStyle,
        }
      );
    }
  };

  const handleClose = () => {
    closeModal();
    setAutoplayTrailer(false);
  };

  return (
    <MuiModal
      open={showModal}
      onClose={handleClose}
      closeAfterTransition
      disableScrollLock={false}
      className="fixed inset-0 z-50"
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0,0,0,0.75)",
          },
        },
      }}
    >
      <div className="flex min-h-svh items-center justify-center p-4 sm:p-6">
        <div className="relative mx-auto w-full max-w-5xl max-h-[90svh] overflow-y-auto overflow-x-hidden rounded-md bg-[#181818] outline-none">
          <Toaster position="bottom-center" />

          <button
            onClick={handleClose}
            className="modalButton absolute right-2 top-2 z-40! h-9 w-9 border-none bg-[#181818] hover:bg-[#181818]"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          <div className="relative bg-black pt-[56.25%]">
            {trailer ? (
              <>
                <iframe
                  key={trailer}
                  className="absolute inset-0 h-full w-full"
                  src={youtubeEmbedUrl}
                  title="Trailer"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  onLoad={() => setIframeLoaded(true)}
                  onError={() => {
                    setIframeErrored(true);
                    setPlayerError("Trailer embed may be blocked in this browser.");
                  }}
                />

                {playerError && (!iframeLoaded || iframeErrored) ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70 px-6 text-center">
                    <div className="space-y-3">
                      <p className="text-sm text-gray-200">
                        Trailer didn&apos;t load. This is usually caused by an ad
                        blocker, tracking protection, or blocked third-party
                        cookies.
                      </p>
                      <a
                        className="inline-flex items-center justify-center rounded bg-white px-4 py-2 text-sm font-semibold text-black hover:opacity-90"
                        href={`https://www.youtube.com/watch?v=${trailer}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open on YouTube
                      </a>
                      {iframeErrored ? (
                        <p className="text-xs text-gray-300">
                          The embed iframe failed to load.
                        </p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                No trailer found.
              </div>
            )}
          </div>

          <div className="flex space-x-16 px-10 py-8">
            <div className="space-y-6 text-lg">
              <div className="flex items-center space-x-2 text-sm">
                <p className="font-semibold text-green-400">
                  {movie ? `${movie.vote_average * 10}% Match` : ""}
                </p>
                <p className="font-light">
                  {movie?.release_date || movie?.first_air_date}
                </p>
                <div className="flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs">
                  HD
                </div>
              </div>

              <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">
                <div className="w-5/6">
                  <p>{movie?.overview}</p>

                  <div className="mt-6 flex items-center gap-3">
                    <button className="modalButton" onClick={handleList}>
                      {addedToList ? (
                        <CheckIcon className="h-7 w-7" />
                      ) : (
                        <PlusIcon className="h-7 w-7" />
                      )}
                    </button>

                    <button className="modalButton" aria-label="Like">
                      <HandThumbUpIcon className="h-7 w-7" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col space-y-3 text-sm">
                  <div>
                    <span className="text-[gray]">Genres: </span>
                    {genres.map((genre) => genre.name).join(", ")}
                  </div>

                  <div>
                    <span className="text-[gray]">Original language: </span>
                    {movie?.original_language}
                  </div>

                  <div>
                    <span className="text-[gray]">Total votes: </span>
                    {movie?.vote_count}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MuiModal>
  );
}