"use client";

import React, { forwardRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";
import {
  Zap,
  Menu,
  Check,
  Shield,
  Users,
  BarChart3,
  Star,
  Twitter,
  Linkedin,
  Github,
  Mail,
} from "lucide-react";
import { ROUTES } from "../config/routes";
import Skeleton from "../components/ui/Skeleton";
import screen from "../assets/screen.png"
import { copyFileToAssets } from '../utils/appUtils'; // Add this import

// --- UTILITY FUNCTION (usually in a separate file like `lib/utils.js`) ---
// This function merges Tailwind CSS classes without conflicts.
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- UI COMPONENTS (usually in separate files) ---

const Button = forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default:
        "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    };
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    };
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

const Card = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

const Badge = forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default:
      "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary:
      "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive:
      "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
  };
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";


export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState(null);
  const [error, setError] = useState(null);

  const handleStartCreating = () => {
    navigate(ROUTES.EDITOR);
  };

  const handleImportFiles = async () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "video/*";
    
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Copy file to assets directory
        const savedFilePath = await window.electron.copyFileToAssets(file.path);
        
        // Create form data for backend
        const formData = new FormData();
        formData.append('file', file);
        formData.append('savedPath', savedFilePath);
        
        // Send to backend
        const response = await fetch('/api/analyze-video/', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Navigate to editor with file info
        navigate(ROUTES.EDITOR, { 
          state: { 
            file,
            savedFilePath,
            originalName: file.name 
          } 
        });
        
      } catch (err) {
        setError(`Error importing file: ${err.message}`);
        console.error('Import error:', err);
      } finally {
        setLoading(false);
      }
    };

    fileInput.click();
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Main Content */}
      <div className="relative z-10"><header className="supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center space-x-2">
            <Zap className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Luna</span>
          </div>          <nav className="hidden items-center space-x-6 md:flex">
            {/* Navigation items can be added here */}
          </nav><div className="flex items-center space-x-4">
            {/* <Button onClick={handleStartCreating}>Start  Creating</Button> */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">              
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <Badge variant="secondary" className="w-fit">
                    🎵 New: AI-Powered Audio Processing
                  </Badge>
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Luna - Your Podcast, Perfected Locally
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Transform your audio content with Luna's intelligent editing platform. 
                    Professional-grade audio editing with AI-powered noise reduction, 
                    transcript editing, and seamless local processing.
                  </p>
                 </div>                <div className="flex flex-col gap-2 min-[400px]:flex-row"> 
                
                  <Button variant="outline" size="lg" className="h-12 bg-white text-black px-8 " onClick={() => navigate(ROUTES.EDITOR)}>
                    Get started now !!!
                  </Button>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>100% Local Processing</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>No Data Upload Required</span>
                  </div>
                </div>
              </div>             
               <div  className="flex items-center justify-center">
                <img
                  src={ screen}
                  width="2000"
                  height="1600"
                  alt="Luna Audio Editor Interface"
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover shadow-2xl rotateY-[-5deg] border-dark-glow"
                  style={{ transform: 'rotateZ(-5deg)' }}
                />
              </div>
            </div>          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="mt-8">
              {loading && (
                <div>
                  <Skeleton className="h-8 w-1/2 mb-2" />
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              )}
              {error && <div className="text-red-500">{error}</div>}
            </div>
          </div>
        </section>
      </main>
      </div>
    </div>
  );
}