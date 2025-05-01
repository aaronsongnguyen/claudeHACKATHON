import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log('Received prompt:', prompt);

    return new Promise((resolve) => {
      // Update the path to be relative to the API route
      const pythonScriptPath = path.join(process.cwd(), 'app', 'discovery', 'main.py');
      console.log('Python script path:', pythonScriptPath);
      
      const pythonProcess = spawn('python3', [pythonScriptPath], {
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let result = '';
      let errorOutput = '';

      // Send the prompt to the Python process
      pythonProcess.stdin.write(prompt + '\n');
      pythonProcess.stdin.end();

      pythonProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log('Python stdout:', output);
        result += output;
      });

      pythonProcess.stderr.on('data', (data) => {
        const error = data.toString();
        console.error('Python stderr:', error);
        errorOutput += error;
      });

      pythonProcess.on('error', (error) => {
        console.error('Failed to start Python process:', error);
        resolve(NextResponse.json({ 
          error: 'Failed to start Python process',
          details: error.message 
        }, { status: 500 }));
      });

      pythonProcess.on('close', (code) => {
        console.log('Python process exited with code:', code);
        if (code !== 0) {
          resolve(NextResponse.json({ 
            error: 'Process failed',
            details: errorOutput || 'Unknown error'
          }, { status: 500 }));
          return;
        }

        resolve(NextResponse.json({ result }));
      });
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 