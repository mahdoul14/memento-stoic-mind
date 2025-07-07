
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface DashboardHeaderProps {
  onSignOut: () => void;
}

export const DashboardHeader = ({ onSignOut }: DashboardHeaderProps) => {
  const handleSignOut = async () => {
    try {
      console.log('Signing out...');
      await onSignOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="flex justify-between items-center p-6 bg-white shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-black">Good morning.</h1>
        <p className="text-gray-500 text-sm mt-1">Let's make today meaningful</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full"></div>
        </div>
        <Button
          onClick={handleSignOut}
          variant="ghost"
          size="sm"
          className="text-gray-600 hover:text-black hover:bg-gray-100 transition-all duration-200 hover:scale-105"
        >
          <LogOut size={16} />
        </Button>
      </div>
    </div>
  );
};
