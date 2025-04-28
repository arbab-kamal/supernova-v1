import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Share2 } from 'lucide-react';

export default function ShareNotes() {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      axios
        .get('http://localhost:8080/getAllUsers')
        .then(response => setUsers(response.data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [open]);

  return (
    <>
      <Button
  variant="ghost"
  onClick={() => setOpen(true)}
  className="w-full flex justify-start items-center text-white hover:bg-white/10"
>
  <Share2 className="w-4 h-4 text-white" />
</Button>


      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[600px]">
          <DialogHeader>
            <DialogTitle>Share with Users</DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex justify-center py-10">
              Loading
            </div>
          ) : error ? (
            <p className="text-red-600">Error: {error}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
