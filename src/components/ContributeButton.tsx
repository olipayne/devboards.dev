'use client';

import { Button } from "@/components/ui/button";
import { Plus, Github } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ContributeButton() {
  const templateJson = `{
  "name": "",
  "manufacturer": "",
  "releaseDate": "YYYY-MM-DD",
  // ... Add more fields as needed
}`;

  const createGithubIssueUrl = () => {
    const title = encodeURIComponent("Add New Board");
    const template = encodeURIComponent(templateJson);
    const body = encodeURIComponent(
      `## New Board Submission

Please fill out the template below with your board's details. You can find a complete template at \`src/data/boards/template.json\`.

\`\`\`json
${template}
\`\`\`

## Checklist
- [ ] I have filled out all the required fields
- [ ] I have added an image URL for the board
- [ ] I have verified all the information is accurate
- [ ] I have tested the JSON is valid
`
    );
    
    return `https://github.com/olipayne/devboards.dev/issues/new?title=${title}&body=${body}&labels=new-board`;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add a Board
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Contribute a New Board</DialogTitle>
          <DialogDescription>
            Help grow the devboards.dev database by adding a new development board.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Option 1: Quick Submit</h3>
            <p className="text-sm text-muted-foreground">
              Create a new issue with a pre-filled template. We&apos;ll review and add the board for you.
            </p>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => window.open(createGithubIssueUrl(), '_blank')}
            >
              <Github className="h-4 w-4" />
              Create GitHub Issue
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Option 2: Submit via Pull Request</h3>
            <p className="text-sm text-muted-foreground">
              For direct contributions, you can create a pull request with your board&apos;s JSON file.
            </p>
            <div className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Copy the template JSON below</li>
                <li>Create a new file in <code>src/data/boards/</code> with your board&apos;s name</li>
                <li>Fill in all the details</li>
                <li>Submit a pull request</li>
              </ol>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <pre className="text-sm font-mono">
                  {templateJson}
                </pre>
              </ScrollArea>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => window.open('https://github.com/olipayne/devboards.dev/fork', '_blank')}
              >
                <Github className="h-4 w-4" />
                Fork Repository
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
