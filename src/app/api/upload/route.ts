/// <reference path="../../../../cloudflare-env.d.ts" />

type Env = Cloudflare.Env; 

export const config = {
    runtime: "edge",
  };
  
  export async function POST(request: Request, env: Env): Promise<Response> {
    try {
      const formData = await request.formData();
      const file = formData.get("file") as File;
  
      if (!file || !(file instanceof File)) {
        return new Response(JSON.stringify({ message: "No file uploaded" }), { status: 400 });
      }
  
      const key = `uploads/${Date.now()}_${file.name}`;
  
      await env.R2.put(key, file.stream(), {
        httpMetadata: {
          contentType: file.type,
        },
      });
  
      const publicUrl = `${env.R2_PUBLIC_URL}/${key}`;
  
      return new Response(JSON.stringify({ message: "Upload successful", key, url: publicUrl }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ message: "Upload failed", error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  