import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Home() {
  return (
    <div className="flex items-center justify-center bg-slate-100 min-h-screen">
      <Card className="w-3/4 h-[50rem] grid grid-rows-[min-content,1fr,min-content]">
        <CardHeader>
          <CardTitle>Semantic Chat Bot</CardTitle>
          <CardDescription>Educaia's Interview by Ismael :)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Avatar>
              <AvatarFallback>aia</AvatarFallback>
              <AvatarImage src="/educaia_avatar.webp" alt="Educaia Avatar" />
            </Avatar>
          </div>
          <div>
            <Avatar>
              <AvatarFallback>you</AvatarFallback>
              <AvatarImage src="/personal_avatar.webp" alt="Personal Avatar" />
            </Avatar>
          </div>
        </CardContent>
        <CardFooter className="gap-x-2">
          <Input placeholder="Message SemanticBot..." />
          <Button type="submit">Send</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

