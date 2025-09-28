import LaunchCalendarButton from "@/conponents/ui/LaunchCalendarButton";

export default function Home() {
  
  return (
    <div className="max-w-3xl">
      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-800 mb-4 animate-fade-in-down">
        Welcome to My Calendar
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto animate-fade-in-up">
        This is your central hub for managing events, tasks, and important
        dates. Get an overview of your schedule at a glance and stay organized.
      </p>
      <LaunchCalendarButton />
    </div>
  );
}
