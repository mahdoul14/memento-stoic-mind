
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

const Hero = () => {
  const { ref: leftPhoneRef, isVisible: leftPhoneVisible } = useScrollAnimation();
  const { ref: rightPhoneRef, isVisible: rightPhoneVisible } = useScrollAnimation();

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="container mx-auto px-6 text-center">
        <div className="animate-fade-in">
          <h1 className="font-inter font-bold text-5xl lg:text-7xl text-black mb-6 tracking-tight">
            Become Stoic in the Age of Distraction
          </h1>
          <p className="font-inter text-xl lg:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            A calm AI dashboard for discipline, clarity, and reflection.
          </p>
          
          <Button className="bg-black text-white hover:bg-gray-800 hover:scale-105 hover:shadow-lg rounded-full px-8 py-4 text-lg font-inter font-medium mb-16 group transition-all duration-200 ease-in-out">
            Enter the Temple
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 justify-center items-center max-w-5xl mx-auto">
          {/* Phone 1 - Main Dashboard */}
          <div 
            ref={leftPhoneRef}
            className={`relative transition-all duration-700 ease-out delay-300 ${
              leftPhoneVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="w-72 h-[580px] bg-black rounded-[2.5rem] p-2 transform perspective-1000 rotate-y-[-12deg] rotate-x-[8deg] shadow-2xl">
              <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden flex flex-col">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 py-3 text-xs text-black">
                  <span className="font-medium">9:41</span>
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-4 h-2 bg-black rounded-sm"></div>
                    <div className="w-6 h-2 bg-black rounded-sm"></div>
                  </div>
                </div>
                
                {/* App Content */}
                <div className="flex-1 px-6 pb-6 flex flex-col">
                  {/* Header */}
                  <div className="py-4">
                    <h2 className="text-2xl font-bold text-black mb-1">Good morning.</h2>
                  </div>
                  
                  {/* Main Cards */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {/* Memento Mori Card */}
                    <div className="bg-black rounded-2xl p-4 text-white">
                      <div className="text-xs mb-2 opacity-70">Memento Mori</div>
                      <div className="text-sm font-medium mb-2">Remember your mortality.</div>
                      <div className="bg-white/20 rounded-full px-3 py-1 text-xs text-center">
                        Begin
                      </div>
                    </div>
                    
                    {/* Daily Reflection Card */}
                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                      <div className="text-xs mb-2 text-gray-600">Daily Reflection</div>
                      <div className="text-sm font-medium mb-2 text-black">Compose a journal entry.</div>
                      <div className="border border-gray-300 rounded-full px-3 py-1 text-xs text-center text-black">
                        Begin
                      </div>
                    </div>
                  </div>
                  
                  {/* Virtue Tracking Section */}
                  <div className="mb-6">
                    <div className="text-xs text-gray-500 mb-4 tracking-wider">TRACK YOUR VIRTUES</div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="space-y-2">
                        {[
                          { name: 'wisdom', icon: '⚡' },
                          { name: 'courage', icon: '♥' },
                          { name: 'temperance', icon: '♥' },
                          { name: 'justice', icon: '🏛' }
                        ].map((virtue, i) => (
                          <div key={virtue.name} className="flex items-center gap-2">
                            <div className="w-6 h-6 border border-black rounded-full flex items-center justify-center text-xs">
                              {virtue.icon}
                            </div>
                            <span className="text-sm text-black">{virtue.name}</span>
                          </div>
                        ))}
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-black">3/7</div>
                        <div className="text-xs text-gray-500">days</div>
                        <div className="text-xs text-gray-400 mt-2">Covered this week</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Bottom Navigation */}
                <div className="flex justify-between items-center px-8 py-4 border-t border-gray-100">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-black rounded"></div>
                    <span className="text-xs text-black font-medium mt-1">Today</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    <span className="text-xs text-gray-400 mt-1">Inspirations</span>
                  </div>
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <div className="w-4 h-0.5 bg-white"></div>
                      <div className="w-0.5 h-4 bg-white absolute"></div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    <span className="text-xs text-gray-400 mt-1">Library</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    <span className="text-xs text-gray-400 mt-1">Journey</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Phone 2 - Memento Mori Focus */}
          <div 
            ref={rightPhoneRef}
            className={`relative transition-all duration-700 ease-out delay-[450ms] ${
              rightPhoneVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="w-72 h-[580px] bg-black rounded-[2.5rem] p-2 transform perspective-1000 rotate-y-[12deg] rotate-x-[8deg] shadow-2xl">
              <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden flex flex-col">
                {/* Status Bar */}
                <div className="flex justify-between items-center px-6 py-3 text-xs text-black">
                  <span className="font-medium">9:41</span>
                  <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="flex gap-1">
                    <div className="w-4 h-2 bg-black rounded-sm"></div>
                    <div className="w-6 h-2 bg-black rounded-sm"></div>
                  </div>
                </div>
                
                {/* App Content - Virtue Detail View */}
                <div className="flex-1 px-6 pb-6 flex flex-col justify-center items-center text-center">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-black mb-6">Track Your Virtues</h2>
                    
                    {/* Virtue Progress Circle */}
                    <div className="relative w-32 h-32 mx-auto mb-8">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 128 128">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${56 * 2 * Math.PI}`}
                          strokeDashoffset={`${56 * 2 * Math.PI * (1 - 0.43)}`}
                          className="text-black"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-2xl font-bold text-black">3/7</div>
                        <div className="text-xs text-gray-500">days</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500 mb-2">Covered this week</div>
                  </div>
                  
                  {/* Virtue List */}
                  <div className="space-y-3 w-full max-w-48">
                    {[
                      { name: 'wisdom', icon: '⚡', completed: true },
                      { name: 'courage', icon: '♥', completed: true },
                      { name: 'temperance', icon: '♥', completed: true },
                      { name: 'justice', icon: '🏛', completed: false }
                    ].map((virtue, i) => (
                      <div key={virtue.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 border rounded-full flex items-center justify-center text-xs ${
                            virtue.completed ? 'border-black bg-black text-white' : 'border-gray-300'
                          }`}>
                            {virtue.completed ? '✓' : virtue.icon}
                          </div>
                          <span className={`text-sm ${virtue.completed ? 'text-black font-medium' : 'text-gray-400'}`}>
                            {virtue.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Bottom Navigation */}
                <div className="flex justify-between items-center px-8 py-4 border-t border-gray-100">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    <span className="text-xs text-gray-400 mt-1">Today</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    <span className="text-xs text-gray-400 mt-1">Inspirations</span>
                  </div>
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                    <div className="w-6 h-6 flex items-center justify-center">
                      <div className="w-4 h-0.5 bg-white"></div>
                      <div className="w-0.5 h-4 bg-white absolute"></div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    <span className="text-xs text-gray-400 mt-1">Library</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 bg-gray-300 rounded"></div>
                    <span className="text-xs text-gray-400 mt-1">Journey</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
