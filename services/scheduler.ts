import { ClassSession, Topic } from '../types';

export const calculateSchedule = (
  startDate: string,
  endDate: string,
  weeklyHours: number,
  orderedTopics: Topic[]
): ClassSession[] => {
  const schedule: ClassSession[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  let currentWeekStart = new Date(start);
  
  // Create a working copy of topics to consume
  const remainingTopics = [...orderedTopics];
  
  // Safety break to prevent infinite loops
  let weekLimit = 0;
  
  while (currentWeekStart < end && remainingTopics.length > 0 && weekLimit < 104) {
    const weekEnd = new Date(currentWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const session: ClassSession = {
      weekStart: currentWeekStart.toISOString(),
      weekEnd: weekEnd.toISOString(),
      topics: [],
      hoursUsed: 0
    };

    // Fill the week with topics
    while (remainingTopics.length > 0) {
      const nextTopic = remainingTopics[0];
      const hoursUsed = session.hoursUsed;
      // Calculate remaining capacity for this week
      const remainingCap = Math.max(0, weeklyHours - hoursUsed);

      // If week is effectively full (using a small epsilon for float comparison), break
      if (remainingCap <= 0.01) {
        break;
      }

      // Check if the topic fits entirely in the remaining time
      if (nextTopic.estimatedHours <= remainingCap + 0.01) {
        session.topics.push(nextTopic);
        session.hoursUsed += nextTopic.estimatedHours;
        remainingTopics.shift();
      } else {
        // Topic does not fit, split it!
        // Allocate what we can to this week
        const hoursForThisWeek = Number(remainingCap.toFixed(1));
        const hoursRemaining = Number((nextTopic.estimatedHours - hoursForThisWeek).toFixed(1));
        
        // Determine titles for parts
        // Check if the title already has (Part X) to increment correctly
        const baseTitleMatch = nextTopic.title.match(/^(.*) \(Part (\d+)\)$/);
        let baseTitle = nextTopic.title;
        let currentPartNum = 1;

        if (baseTitleMatch) {
            baseTitle = baseTitleMatch[1];
            currentPartNum = parseInt(baseTitleMatch[2]);
        }
        
        // Create the part for the current week
        const thisWeekTopic: Topic = {
            ...nextTopic,
            title: `${baseTitle} (Part ${currentPartNum})`,
            estimatedHours: hoursForThisWeek
        };

        // Create the remainder part for the next week
        const nextWeekTopic: Topic = {
            ...nextTopic,
            title: `${baseTitle} (Part ${currentPartNum + 1})`,
            estimatedHours: hoursRemaining
        };

        // Add Part 1 to current session
        session.topics.push(thisWeekTopic);
        session.hoursUsed += hoursForThisWeek;
        
        // Replace the head of the queue with Part 2 (remainder)
        remainingTopics[0] = nextWeekTopic;
        
        // The loop will continue, but since remainingCap is now ~0, it will break at the start of next iteration
      }
    }

    // Round for clean display
    session.hoursUsed = Number(session.hoursUsed.toFixed(1));

    schedule.push(session);
    
    // Move to next week
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    weekLimit++;
  }

  return schedule;
};

export const getStatusColor = (percentage: number) => {
  if (percentage >= 100) return '#10b981'; // Green
  if (percentage >= 50) return '#f59e0b'; // Amber
  return '#ef4444'; // Red
};