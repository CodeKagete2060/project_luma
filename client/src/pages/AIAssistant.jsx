import React from 'react';
import AIChatInterface from '../components/student/AIChatInterface';
import { useToast } from '../hooks/use-toast';

function AIAssistant() {
  const { toast } = useToast();

  React.useEffect(() => {
    toast({
      title: 'AI Assistant Ready',
      description: 'Ask me anything about your studies!',
    });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">AI Learning Assistant</h1>
      <AIChatInterface className="max-w-4xl mx-auto" />
    </div>
  );
}

export default AIAssistant;