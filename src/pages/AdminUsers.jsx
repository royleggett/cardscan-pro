import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Trash2, Mail, Shield, User, ArrowLeft, UserPlus, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToPromote, setUserToPromote] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("admin");
  const [inviting, setInviting] = useState(false);
  const [inviteStatus, setInviteStatus] = useState("idle"); // idle | sent | error
  const [inviteError, setInviteError] = useState("");

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

  const handleToggleAdmin = async () => {
    const newRole = userToPromote.role === "admin" ? "user" : "admin";
    await base44.entities.User.update(userToPromote.id, { role: newRole });
    setUsers(users.map(u => u.id === userToPromote.id ? { ...u, role: newRole } : u));
    setUserToPromote(null);
  };

  const handleInvite = async () => {
    const email = inviteEmail.trim();
    if (!email) return;
    setInviting(true);
    setInviteError("");
    try {
      await base44.users.inviteUser(email, inviteRole);
      setInviteStatus("sent");
      setInviting(false);
      setTimeout(() => {
        setInviteOpen(false);
        setInviteStatus("idle");
        setInviteEmail("");
        setInviteRole("admin");
        loadData();
      }, 2000);
    } catch (err) {
      setInviteStatus("error");
      setInviteError(err?.message || "Unknown error");
      setInviting(false);
    }
  };

  const closeInvite = (v) => {
    if (!v) {
      setInviteStatus("idle");
      setInviteEmail("");
      setInviteRole("admin");
      setInviteError("");
    }
    setInviteOpen(v);
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

        <Button
          onClick={() => setInviteOpen(true)}
          className="w-full mb-6 bg-blue-600 hover:bg-blue-700"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Invite New User
        </Button>

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
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-400 hover:text-blue-600 hover:bg-blue-50"
                        title={u.role === "admin" ? "Remove admin" : "Make admin"}
                        onClick={() => setUserToPromote(u)}
                      >
                        <Shield className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => setUserToDelete(u)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AlertDialog open={!!userToPromote} onOpenChange={() => setUserToPromote(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{userToPromote?.role === "admin" ? "Remove Admin?" : "Make Admin?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {userToPromote?.role === "admin"
                ? `This will remove admin privileges from ${userToPromote?.full_name} (${userToPromote?.email}).`
                : `This will give ${userToPromote?.full_name} (${userToPromote?.email}) full admin access to the app.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleAdmin} className="bg-blue-600 hover:bg-blue-700">
              {userToPromote?.role === "admin" ? "Remove Admin" : "Make Admin"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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

      <Dialog open={inviteOpen} onOpenChange={closeInvite}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
            <DialogDescription>
              Send an invitation email. The recipient will set up their own password to join the app.
            </DialogDescription>
          </DialogHeader>

          {inviteStatus === "sent" ? (
            <div className="flex flex-col items-center py-6 gap-2">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-center font-medium text-gray-900">Invitation sent!</p>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Email Address</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="support@cardscan-pro.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && inviteEmail.trim() && !inviting) handleInvite();
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="admin">Admin (full access)</option>
                  <option value="user">User (standard access)</option>
                </select>
              </div>
              {inviteStatus === "error" && (
                <p className="text-sm text-red-600">{inviteError}</p>
              )}
            </div>
          )}

          {inviteStatus !== "sent" && (
            <DialogFooter>
              <Button variant="outline" onClick={() => closeInvite(false)}>Cancel</Button>
              <Button
                onClick={handleInvite}
                disabled={!inviteEmail.trim() || inviting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {inviting ? "Sending..." : "Send Invitation"}
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}