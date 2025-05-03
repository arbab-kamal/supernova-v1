import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Send, Plus, X } from 'lucide-react';

export default function EmailInput({ 
  onSubmit, 
  className = '',
  buttonText = "Send",
  showSubject = true
}) {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [additionalEmails, setAdditionalEmails] = useState([]);
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEmailError('');

    // Validate primary email
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Validate all additional emails
    for (const additionalEmail of additionalEmails) {
      if (!validateEmail(additionalEmail)) {
        setEmailError(`${additionalEmail} is not a valid email address`);
        return;
      }
    }

    // Combine all emails
    const allEmails = [email, ...additionalEmails].filter(Boolean);
    
    // Submit the form data
    onSubmit({
      emails: allEmails,
      subject: subject
    });
    
    // Reset form
    setEmail('');
    setSubject('');
    setAdditionalEmails([]);
  };

  const addEmailField = () => {
    setAdditionalEmails([...additionalEmails, '']);
  };

  const updateAdditionalEmail = (index, value) => {
    const newEmails = [...additionalEmails];
    newEmails[index] = value;
    setAdditionalEmails(newEmails);
  };

  const removeAdditionalEmail = (index) => {
    const newEmails = [...additionalEmails];
    newEmails.splice(index, 1);
    setAdditionalEmails(newEmails);
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <div className="flex gap-2 mt-1">
            <Input
              id="email"
              type="text"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={addEmailField}
              title="Add another recipient"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {additionalEmails.map((additionalEmail, index) => (
          <div key={index} className="flex gap-2">
            <Input
              type="text"
              placeholder="Additional email"
              value={additionalEmail}
              onChange={(e) => updateAdditionalEmail(index, e.target.value)}
              className="flex-1"
            />
            <Button 
              type="button" 
              variant="outline" 
              size="icon"
              onClick={() => removeAdditionalEmail(index)}
              title="Remove this recipient"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {showSubject && (
          <div>
            <Label htmlFor="subject" className="text-sm font-medium">
              Subject
            </Label>
            <Input
              id="subject"
              type="text"
              placeholder="Email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1"
            />
          </div>
        )}

        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}

        <Button type="submit" className="w-full">
          <Send className="mr-2 h-4 w-4" />
          {buttonText}
        </Button>
      </form>
    </div>
  );
}