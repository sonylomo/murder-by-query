import { useState, useEffect } from "react";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Pen } from "lucide-react";

export function NotesPanel() {
    const [notes, setNotes] = useState("");

    useEffect(() => {
        const storedNotes = localStorage.getItem("notes");
        if (storedNotes) {
            setNotes(storedNotes);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("notes", notes);
    }, [notes]);

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="px-0">
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Pen className="w-6 h-6 text-primary" />
                    Notes
                </CardTitle>
                <CardDescription>Review the details of your notes</CardDescription>
            </CardHeader>
            <CardContent className="px-0">
                <div className="prose prose-sm dark:prose-invert max-w-none bg-white rounded-2xl border border-border/50">
                    <Textarea 
                        placeholder="Type your notes here..." 
                        className="rounded-2xl" 
                        onChange={(e) => setNotes(e.target.value)} 
                        value={notes} 
                    />
                </div>
            </CardContent>
        </Card>
    );
}