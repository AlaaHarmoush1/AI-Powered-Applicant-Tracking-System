import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { resumes } from "../../constants";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart Feedback for your Dream Job" },
  ];
}

export default function Home() {

  const { auth } = usePuterStore()
    const navigate = useNavigate()

    useEffect( () => {
        if(!auth.isAuthenticated) navigate('/auth?next=/')
    }, [auth.isAuthenticated])


  return <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen items-center justify-center">

    <Navbar />
      <section className="main-section">
        <div className="page-heading">
          <h1>Track Your Applications and Resume Rating</h1>
          <h2>Review your submissions and check AI-Powered Feedback</h2>
        </div>

        {resumes.length !== 0 && (
          <div className="resumes-section">
            {resumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </section>

      
    </main>;
}
