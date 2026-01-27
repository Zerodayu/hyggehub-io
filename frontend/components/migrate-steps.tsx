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
import { useState, useCallback } from 'react';
import type { FileWithPreview } from '@/hooks/use-file-upload';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { usePapaParse } from 'react-papaparse';
import { Checkbox } from './ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

const steps = [{ title: 'Upload File' }, { title: 'Select Columns' }, { title: 'Validating' }, { title: 'Confirmation' }];

interface ParsedData {
  headers: string[];
  rows: any[][];
}

export default function MigrateSteps() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const [parsedData, setParsedData] = useState<ParsedData | null>(null);
  const [selectedColumns, setSelectedColumns] = useState<Set<number>>(new Set());
  const [jsonData, setJsonData] = useState<any[] | null>(null);
  const { readString } = usePapaParse();

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const handleFilesChange = useCallback(async (files: FileWithPreview[]) => {
    setUploadedFiles(files);
    
    if (files.length > 0) {
      const file = files[0].file;
      
      if (file instanceof File) {
        const text = await file.text();
        
        readString(text, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => {
            const [headers, ...rows] = results.data as string[][];
            setParsedData({ headers, rows });
            // Select all columns by default
            setSelectedColumns(new Set(headers.map((_, index) => index)));
          }
        });
      }
    }
  }, [readString]);

  const handleColumnToggle = (index: number) => {
    setSelectedColumns(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (parsedData) {
      if (selectedColumns.size === parsedData.headers.length) {
        setSelectedColumns(new Set());
      } else {
        setSelectedColumns(new Set(parsedData.headers.map((_, index) => index)));
      }
    }
  };

  const handleValidate = () => {
    if (parsedData) {
      const selectedHeaders = parsedData.headers.filter((_, index) => selectedColumns.has(index));
      const selectedData = parsedData.rows.map(row => {
        const obj: any = {};
        selectedHeaders.forEach((header, headerIndex) => {
          const originalIndex = parsedData.headers.indexOf(header);
          obj[header] = row[originalIndex];
        });
        return obj;
      });
      
      setJsonData(selectedData);
      nextStep();
    }
  };

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
          <TableUpload accept="text/csv" onFilesChange={handleFilesChange} />
          {uploadedFiles.length > 0 && (
            <Button variant="outline" className='font-semibold mt-12 w-full' onClick={nextStep}>
              Next
              <ArrowRight />
            </Button>
          )}
        </StepperContent>

        <StepperContent value={2} className="flex flex-col gap-4">
          <h1 className='text-2xl font-semibold'>Select Columns</h1>
          <p className="text-sm text-muted-foreground">Choose which columns to include in the import</p>
          {parsedData && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox 
                  checked={selectedColumns.size === parsedData.headers.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm font-medium">
                  Select All ({selectedColumns.size}/{parsedData.headers.length} selected)
                </span>
              </div>
              
              <div className="rounded-lg border max-h-[400px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {parsedData.headers.map((header, index) => (
                        <TableHead key={index}>
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              checked={selectedColumns.has(index)}
                              onCheckedChange={() => handleColumnToggle(index)}
                            />
                            <span>{header}</span>
                          </div>
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsedData.rows.slice(0, 5).map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <TableCell 
                            key={cellIndex}
                            className={!selectedColumns.has(cellIndex) ? 'opacity-30' : ''}
                          >
                            {cell}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                    {parsedData.rows.length > 5 && (
                      <TableRow>
                        <TableCell colSpan={parsedData.headers.length} className="text-center text-sm text-muted-foreground">
                          ... and {parsedData.rows.length - 5} more rows
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-between gap-2 mt-4 w-full">
                <Button variant="ghost" className='font-semibold' onClick={prevStep}>
                  <ArrowLeft />
                  Back
                </Button>
                <Button 
                  variant="outline" 
                  className='font-semibold' 
                  onClick={handleValidate}
                  disabled={selectedColumns.size === 0}
                >
                  Next
                  <ArrowRight />
                </Button>
              </div>
            </>
          )}
        </StepperContent>

        <StepperContent value={3} className="flex flex-col items-center justify-center gap-4">
          <h1 className='text-2xl font-semibold'>Validating Data</h1>
          {jsonData && (
            <div className="w-full">
              <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-[400px] text-xs">
                {JSON.stringify(jsonData, null, 2)}
              </pre>
              <div className="flex justify-between gap-2 mt-4 w-full">
                <Button variant="ghost" className='font-semibold' onClick={prevStep}>
                  <ArrowLeft />
                  Back
                </Button>
                <Button variant="outline" className='font-semibold' onClick={nextStep}>
                  Next
                  <ArrowRight />
                </Button>
              </div>
            </div>
          )}
        </StepperContent>

        <StepperContent value={4} className="flex flex-col items-center justify-center gap-4">
          <h1 className='text-2xl font-semibold'>Confirmation</h1>
          <p className="text-muted-foreground">
            {jsonData?.length} rows with {selectedColumns.size} columns ready to be imported
          </p>
          {parsedData && selectedColumns.size > 0 && (
            <div className="w-full rounded-lg border p-4 bg-muted/50">
              <h3 className="text-sm font-semibold mb-2">Selected Columns:</h3>
              <div className="flex flex-wrap gap-2">
                {parsedData.headers
                  .filter((_, index) => selectedColumns.has(index))
                  .map((header, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-md font-medium"
                    >
                      {header}
                    </span>
                  ))}
              </div>
            </div>
          )}
          <div className="flex justify-between gap-2 mt-4 w-full">
            <Button variant="outline" className='font-semibold' onClick={prevStep}>
              <ArrowLeft />
              Back
            </Button>
            <Button className='font-semibold'>
              Confirm Import
            </Button>
          </div>
        </StepperContent>
      </StepperPanel>
    </Stepper>
  );
}