import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2, Mail, Shield, User, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const me = await base44.auth.me();
    if (me?.role !== "admin") {
      window.location.href = createPageUrl("Home");
      return;
    }
    setCurrentUser(me);
    const allUsers = await base44.entities.User.list();
    setUsers(allUsers);
    setLoading(false);
  };

  const handleDelete = async () => {
    await base44.entities.User.delete(userToDelete.id);
    setUsers(users.filter(u => u.id !== userToDelete.id));
    setUserToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl("Home")}>
            <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-500 text-sm">{users.length} registered users</p>
          </div>
        </div>

        <Link to={createPageUrl("AdminPlaces")} className="mb-6 block">
          <Button variant="outline" className="w-full">Moderate Community Places</Button>
        </Link>

        <div className="space-y-3">
          {users.map(u => (
            <Card key={u.id} className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    {u.role === "admin" ? <Shield className="w-5 h-5 text-blue-600" /> : <User className="w-5 h-5 text-gray-500" />}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{u.full_name}</p>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{u.email}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge className={u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}>
                    {u.role}
                  </Badge>
                  {u.email !== currentUser?.email && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => setUserToDelete(u)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{userToDelete?.full_name}</strong> ({userToDelete?.email}). Their data (contacts, exhibitions, places) will remain in the database. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}