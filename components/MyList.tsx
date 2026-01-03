"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { deleteDoc, doc } from "firebase/firestore";

import useList from "@/hooks/useList";
import useAuth from "../hooks/useAuth";
import { getDb } from "../firebase";
import { baseUrl } from "../constants/movie";
import Row from "./Row";
import type { Movie } from "../typings";

type Props = { variant?: "row" | "grid" };

type FirestoreMovieLike = Record<string, unknown> & { id?: unknown };

function toNumberId(id: unknown): number | null {
  if (typeof id === "number" && Number.isFinite(id)) return id;
  if (typeof id === "string") {
    const n = Number(id);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function pickString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function pickNullableString(v: unknown): string | null | undefined {
  if (typeof v === "string") return v;
  if (v === null) return null;
  return undefined;
}

function pickNumber(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

function coerceToMovie(item: unknown): Movie | null {
  if (typeof item !== "object" || item === null) return null;
  const o = item as FirestoreMovieLike;

  const id = toNumberId(o.id);
  if (id == null) return null;

  const vote_average = pickNumber(o.vote_average) ?? 0;
  const vote_count = pickNumber(o.vote_count) ?? 0;

  const media_type =
    o.media_type === "movie" || o.media_type === "tv"
      ? (o.media_type as "movie" | "tv")
      : undefined;

  return {
    id,
    vote_average,
    vote_count,
    title: pickString(o.title),
    name: pickString(o.name),
    original_name: pickString(o.original_name),
    overview: pickString(o.overview),
    poster_path: pickNullableString(o.poster_path),
    backdrop_path: pickNullableString(o.backdrop_path),
    media_type,
    release_date: pickString(o.release_date),
    first_air_date: pickString(o.first_air_date),
    original_language: pickString(o.original_language),
  };
}

export default function MyList({ variant = "row" }: Props) {
  // ✅ ALL hooks up here, always called, every render
  const { user } = useAuth();
  const list = useList(user?.uid);

  const movies = useMemo<Movie[]>(() => {
    if (!Array.isArray(list)) return [];
    return list.map(coerceToMovie).filter((m): m is Movie => m !== null);
  }, [list]);

  const [optimisticallyHidden, setOptimisticallyHidden] = useState<Set<number>>(
    () => new Set()
  );
  const [removingId, setRemovingId] = useState<number | null>(null);

  // Optional but recommended: if Firestore removes the item, drop it from the hidden set
  // so re-adding later will show again.
  useEffect(() => {
    setOptimisticallyHidden((prev) => {
      if (prev.size === 0) return prev;
      const ids = new Set(movies.map((m) => m.id));
      const next = new Set<number>();
      for (const id of prev) if (ids.has(id)) next.add(id);
      return next;
    });
  }, [movies]);

  // ✅ early returns AFTER hooks are declared
  if (!user || movies.length === 0) return null;

  if (variant === "row") {
    // Home page: keep row + modal behavior
    return <Row title="My List" movies={movies} />;
  }

  // My List page: grid + hover checkmark removal
  const visibleMovies = movies.filter((m) => !optimisticallyHidden.has(m.id));
  if (visibleMovies.length === 0) return null;

  const removeFromMyList = async (movieId: number) => {
    setOptimisticallyHidden((prev) => {
      const next = new Set(prev);
      next.add(movieId);
      return next;
    });

    try {
      setRemovingId(movieId);
      const db = getDb();
      await deleteDoc(doc(db, "customers", user.uid, "myList", movieId.toString()));
    } catch (e) {
      // rollback if delete fails
      setOptimisticallyHidden((prev) => {
        const next = new Set(prev);
        next.delete(movieId);
        return next;
      });
      console.error("Failed to remove from My List", e);
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="mt-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {visibleMovies.map((movie) => {
          const posterPath = movie.poster_path || movie.backdrop_path;
          if (!posterPath) return null;

          return (
            <div key={movie.id} className="group relative">
              <div className="relative aspect-2/3 w-full overflow-hidden rounded-sm bg-black">
                <Image
                  src={`${baseUrl}${posterPath}`}
                  alt={movie.title || movie.name || movie.original_name || "Title"}
                  fill
                  className="object-cover"
                />

                <button
                  type="button"
                  aria-label="Remove from My List"
                  disabled={removingId === movie.id}
                  onClick={() => void removeFromMyList(movie.id)}
                  className="modalButton absolute top-2 right-2 z-10 h-8! w-8! opacity-0 transition group-hover:opacity-100 focus:opacity-100"
                >
                  <CheckIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}