const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
];

const DIFFICULTIES = [
  'easy',
  'medium',
  'hard',
];

const MIN_BREAK_DURATION_SECONDS = 30;
const MAX_BREAK_DURATION_SECONDS = 60; 
const MIN_MISSION_DURATION_MINUTES = 10;
const MAX_MISSION_DURATION_MINUTES = 20;

const MISSION_ACTIVITIES = {
  'easy': [
    'Walk to door, come back.',
    'Walk to door, wait 2 seconds, come back.',
    'Put on shoes, come back.',
  ],
  'medium': [
    'Walk to door, turn knob, release, come back.',
    'Walk to door, leave, close door, immediately come back in.',
    'Walk to door, leave, close door, wait 5 seconds, come back in.',
    'Walk to door, leave, close door, walk all the way down stairs, come back.',
    'Pick up keys, come back.',
  ],
  'hard': [
    'Walk to door, leave, close door, walk all the way down stairs, come back.',
    'Walk to door, leave, close door, walk all the way down stairs, wait 5 seconds, come back.',
    'Put on coat, come back.',
  ],
  'final': [
    'Walk to door, leave, close door, wait X seconds.',
  ],
};

class Week {
  constructor(numDays, maxHardDays, minEasyDays, maxEasyDays) {
    if (numDays <= 0) {
      numDays = 1;
    }

    if (numDays > 5) {
      numDays = 5;
    }

    this.numDays = numDays;
    this.maxHardDays = maxHardDays;
    this.minEasyDays = minEasyDays;
    this.maxEasyDays = maxEasyDays;

    this.numHardDays = 0;
    this.missions = {};

    this.generateMissions();
  }

  generateMissions() {
    this.numHardDays = 0;
    this.missions = {};

    const numEasyDays = this.minEasyDays + Math.floor(Math.random() * (this.maxEasyDays - this.minEasyDays + 1));

    const availableEasyDays = [...DAYS];
    for (let i = 0; i < numEasyDays; i++) {
      const dayIndex = Math.floor(Math.random() * availableEasyDays.length);
      const day = DAYS[dayIndex];
      this.missions[day] = 'easy';

      availableEasyDays.splice(dayIndex, 1);
    }
    
    for (let i = 0; i < this.numDays; i++) {
      const day = DAYS[i];

      const difficulty = this.missions.hasOwnProperty(day) ? this.missions[day] : this.getRandomDifficulty();

      if (difficulty === 'hard') {
        this.numHardDays++;
      }

      const mission = new Mission(difficulty);
      this.missions[day] = mission;
    }
  }

  printPlan() {
    console.log('MISSION PLAN');
    for (let i = 0; i < this.numDays; i++) {
      const day = DAYS[i];
      const mission = this.missions[day];
      console.log(`${day.toUpperCase()}`);
      mission.printDetails();
      console.log();
    }
  }

  getRandomDifficulty() {
    const maxDifficultyIndex = this.numHardDays >= this.maxHardDays ? 1 : 2;
    const difficultyIndex = 1 + Math.floor(Math.random() * maxDifficultyIndex);

    return DIFFICULTIES[difficultyIndex];
  };
}

class Mission {
  constructor(difficulty) {
    this.difficulty = difficulty;
    this.durationSeconds = this.generateDuration();
    this.activities = [];

    this.generateActivities();
  }

  generateDuration() {
    const missionDurationMinutes = MIN_MISSION_DURATION_MINUTES + Math.floor(Math.random() * (MAX_MISSION_DURATION_MINUTES - MIN_MISSION_DURATION_MINUTES));
    const missionDurationSeconds = missionDurationMinutes * 60;
    return missionDurationSeconds;
  }

  generateActivities() {
    this.activities = [];

    let remainingDurationSeconds = this.durationSeconds;

    const easyProbability = this.difficulty === 'easy' ? 0.5 : 0.25;
    const mediumProbability = this.difficulty === 'medium' ? 0.5 : 0.25;

    while (remainingDurationSeconds > 0) {
      const breakDurationSeconds = MIN_BREAK_DURATION_SECONDS + Math.floor(Math.random() * (MAX_BREAK_DURATION_SECONDS - MIN_BREAK_DURATION_SECONDS));

      const difficultyProb = Math.random();
      let difficulty;
      if (difficultyProb <= easyProbability) {
        difficulty = 'easy';
      } else if (difficultyProb <= easyProbability + mediumProbability) {
        difficulty = 'medium';
      } else {
        difficulty = 'hard';
      }

      const activities = MISSION_ACTIVITIES[difficulty]
      const randomIndex = Math.floor(Math.random() * activities.length);
      const activity = activities[randomIndex];
      this.activities.push(activity);
      this.activities.push(`BREAK: ${breakDurationSeconds} seconds`);

      remainingDurationSeconds -= breakDurationSeconds + 20;
    }

    const finalActivities = MISSION_ACTIVITIES['final'];
    const randomFinalIndex = Math.floor(Math.random() * finalActivities.length);
    const finalActivity = finalActivities[randomFinalIndex];
    this.activities.push(`FINAL: ${finalActivity}`);
  }

  printDetails() {
    console.log(`\tDifficulty: ${this.difficulty.toUpperCase()}`);
    console.log(`\tDuration: ${this.durationSeconds / 60} minutes`);
    console.log();

    for (let i = 0; i < this.activities.length; i++) {
      console.log(`\t${this.activities[i]}`);

      if (i % 2 === 1) {
        console.log();
      }
    }
  }
}

const numDaysToGenerate = 5;
const minEasyDays = 1;
const maxEasyDays = 2;
const maxHardDays = 2;

const week = new Week(numDaysToGenerate, maxHardDays, minEasyDays, maxEasyDays);
week.printPlan();