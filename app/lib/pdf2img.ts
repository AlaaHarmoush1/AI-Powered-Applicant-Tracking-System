// types/pdfConversion.ts

export interface PdfConversionResult {
  imageUrl: string;
  file: File | null;
  error?: string;
}

let pdfjsLib: any = null;
let isLoading = false;
let loadPromise: Promise<any> | null = null;

export async function convertPdfToImage(file: File): Promise<PdfConversionResult> {
  console.log("[1] Starting PDF conversion for file:", file.name);

  try {
    console.log("[2] Loading PDF.js library...");
    const lib = await loadPdfJs();
    console.log("[3] PDF.js loaded successfully. Library version:", lib.version);

    console.log("[4] Converting file to ArrayBuffer...");
    const arrayBuffer = await file.arrayBuffer();
    console.log("[5] ArrayBuffer obtained, length:", arrayBuffer.byteLength);

    console.log("[6] Loading PDF document...");
    const loadingTask = lib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    console.log("[7] PDF document loaded. Page count:", pdf.numPages);

    console.log("[8] Getting first page...");
    const page = await pdf.getPage(1);
    console.log("[9] Page obtained. Dimensions:", page.getViewport({ scale: 1 }));

    const viewport = page.getViewport({ scale: 4 });
    console.log("[10] Viewport created at scale 4. Dimensions:", viewport);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) {
      throw new Error("Failed to get 2D canvas context");
    }

    canvas.width = viewport.width;
    canvas.height = viewport.height;
    console.log("[11] Canvas created with dimensions:", canvas.width, "x", canvas.height);

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    console.log("[12] Rendering page to canvas...");
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    await page.render(renderContext).promise;
    console.log("[13] Page rendered successfully");

    return new Promise((resolve) => {
      console.log("[14] Converting canvas to blob...");
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log("[15] Blob created successfully. Size:", blob.size);
            const originalName = file.name.replace(/\.pdf$/i, "");
            const imageFile = new File([blob], `${originalName}.png`, {
              type: "image/png",
            });

            const imageUrl = URL.createObjectURL(blob);
            console.log("[16] Image URL created:", imageUrl.substring(0, 50) + "...");
            
            resolve({
              imageUrl: imageUrl,
              file: imageFile,
            });
          } else {
            console.error("[15] Failed to create blob from canvas");
            resolve({
              imageUrl: "",
              file: null,
              error: "Failed to create image blob",
            });
          }
        },
        "image/png",
        1.0
      );
    });
  } catch (err) {
    console.error("[ERROR] Conversion failed:", err);
    return {
      imageUrl: "",
      file: null,
      error: `Failed to convert PDF: ${(err as Error).message}`,
    };
  }
}

async function loadPdfJs(): Promise<any> {
  console.log("[LOAD-1] Checking PDF.js initialization...");
  
  if (pdfjsLib) {
    console.log("[LOAD-2] PDF.js already loaded");
    return pdfjsLib;
  }
  
  if (loadPromise) {
    console.log("[LOAD-2] PDF.js loading in progress");
    return loadPromise;
  }

  console.log("[LOAD-3] Starting PDF.js initialization");
  isLoading = true;

  try {
    loadPromise = import("pdfjs-dist").then(async (lib) => {
      console.log("[LOAD-4] PDF.js module loaded, setting up worker");
      
      // Modern approach using dynamic import
      const workerModule = await import("pdfjs-dist/build/pdf.worker.mjs?url");
      lib.GlobalWorkerOptions.workerSrc = workerModule.default;
      
      console.log("[LOAD-5] Worker configured:", lib.GlobalWorkerOptions.workerSrc);
      
      pdfjsLib = lib;
      isLoading = false;
      return lib;
    });

    return await loadPromise;
  } catch (err) {
    console.error("[LOAD-ERROR] Failed to load PDF.js:", err);
    isLoading = false;
    loadPromise = null;
    throw err;
  }
}
