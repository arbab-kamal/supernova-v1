import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { X, Plus } from 'lucide-react'

interface EmailInputProps {
  onSubmit: (data: { emails: string[], subject: string }) => void;
  buttonText?: string;
  disabled?: boolean;
  defaultSubject?: string;
}

export default function EmailInput({ 
  onSubmit, 
  buttonText = "Send Email", 
  disabled = false,
  defaultSubject = ""
}: EmailInputProps) {
  const [emails, setEmails] = useState<string[]>(['']);
  const [subject, setSubject] = useState(defaultSubject);
  const [emailErrors, setEmailErrors] = useState<string[]>([]);

  const validateEmail = (email: string): boolean => {
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);

    // Clear error when typing
    const newErrors = [...emailErrors];
    newErrors[index] = '';
    setEmailErrors(newErrors);
  };

  const addEmailField = () => {
    setEmails([...emails, '']);
    setEmailErrors([...emailErrors, '']);
  };

  const removeEmailField = (index: number) => {
    if (emails.length > 1) {
      const newEmails = emails.filter((_, i) => i !== index);
      const newErrors = emailErrors.filter((_, i) => i !== index);
      setEmails(newEmails);
      setEmailErrors(newErrors);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all emails
    const newErrors = emails.map(email => 
      email.trim() === '' ? 'Email is required' : 
      !validateEmail(email) ? 'Invalid email format' : 
      ''
    );
    
    setEmailErrors(newErrors);
    
    // Check if there are any errors
    if (newErrors.some(error => error !== '')) {
      return;
    }
    
    // Filter out any empty emails (shouldn't happen with validation)
    const validEmails = emails.filter(email => email.trim() !== '');
    
    // Call the onSubmit callback with the validated data
    onSubmit({
      emails: validEmails,
      subject: subject
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Enter email subject"
          className="w-full"
        />
      </div>

      <div className="space-y-3">
        <Label>Email Recipients</Label>
        
        {emails.map((email, index) => (
          <div key={index} className="flex gap-2 items-center">
            <div className="flex-1">
              <Input
                value={email}
                onChange={(e) => handleEmailChange(index, e.target.value)}
                placeholder="email@example.com"
                className={emailErrors[index] ? "border-red-500" : ""}
              />
              {emailErrors[index] && (
                <p className="text-sm text-red-500 mt-1">{emailErrors[index]}</p>
              )}
            </div>
            
            <Button 
              type="button"
              variant="ghost" 
              size="icon"
              onClick={() => removeEmailField(index)}
              disabled={emails.length === 1}
              className="h-9 w-9 flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addEmailField}
          className="flex items-center"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Recipient
        </Button>
      </div>

      <div className="pt-2">
        <Button 
          type="submit" 
          disabled={disabled}
          className="w-full"
        >
          {buttonText}
        </Button>
      </div>
    </form>
  );
}