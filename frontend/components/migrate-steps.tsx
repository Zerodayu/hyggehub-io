import {
  Stepper,
  StepperContent,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperPanel,
  StepperTitle,
  StepperTrigger,
} from '@/components/ui/stepper2';
import TableUpload from "@/components/table-upload"
import { Button } from './ui/button';
import { useState } from 'react';
import type { FileWithPreview } from '@/hooks/use-file-upload';
import { ArrowRight } from 'lucide-react';

const steps = [{ title: 'Upload File' }, { title: 'Select Options' }, { title: 'Validating' }, { title: 'Confirmation' }];

export default function MigrateSteps() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))

  return (
    <Stepper value={currentStep} className="space-y-8 w-full">
      <StepperNav className="gap-3.5 mb-15">
        {steps.map((step, index) => {
          return (
            <StepperItem key={index} step={index + 1} className="relative flex-1 items-start pointer-events-none">
              <StepperTrigger className="flex flex-col items-start justify-center gap-3.5 grow">
                <StepperIndicator className="bg-border rounded-full h-1 w-full data-[state=active]:bg-primary"></StepperIndicator>
                <div className="flex flex-col items-start gap-1">
                  <StepperTitle className="text-start font-semibold group-data-[state=inactive]/step:text-muted-foreground">
                    {step.title}
                  </StepperTitle>
                </div>
              </StepperTrigger>
            </StepperItem>
          );
        })}
      </StepperNav>

      <StepperPanel className="text-sm">
        <StepperContent value={1} className="flex flex-col items-center justify-center gap-4">
          <h1 className='text-2xl font-semibold'>Upload CSV File</h1>
          <TableUpload accept="text/csv" onFilesChange={setUploadedFiles} />
          {uploadedFiles.length > 0 && (
            <Button variant="outline" className='font-semibold mt-12 w-full' onClick={nextStep}>
              Next
              <ArrowRight />
            </Button>
          )}
        </StepperContent>

        <StepperContent value={2} className="flex items-center justify-center">
          {/* Select Options component */}
          <div>Select Options content</div>
        </StepperContent>

        <StepperContent value={3} className="flex items-center justify-center">
          {/* Validating component */}
          <div>Validating content</div>
        </StepperContent>

        <StepperContent value={4} className="flex items-center justify-center">
          {/* Confirmation component */}
          <div>Confirmation content</div>
        </StepperContent>
      </StepperPanel>
    </Stepper>
  );
}
