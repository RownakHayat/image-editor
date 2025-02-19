import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function RefreshButton() {
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <>
      {/* <button onClick={refreshPage}>
      <RefreshCw style = {{color: '#30329e'}}/>
      </button> */}

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
              <RefreshCw style={{ color: '#30329e' }} onClick={refreshPage}/>
          </TooltipTrigger>
          <TooltipContent>
            <p>Chatbot Refresh</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  );
}

export default RefreshButton;
