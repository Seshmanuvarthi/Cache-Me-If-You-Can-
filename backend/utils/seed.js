require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Team = require('../models/Team');
const Question = require('../models/Question');

const SALT_ROUNDS = 10;

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Team.deleteMany({});
    await Question.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // =====================
    // INSERT TEAMS
    // =====================
    const teamsData = [
      { teamId: 'TEAM1', password: 'pass123' },
      { teamId: 'TEAM2', password: 'pass123' },
      { teamId: 'TEAM3', password: 'pass123' },
      { teamId: 'TEAM4', password: 'pass123' },
      { teamId: 'TEAM5', password: 'pass123' }
    ];

    const hashedTeams = await Promise.all(
      teamsData.map(async (team) => ({
        teamId: team.teamId,
        password: await bcrypt.hash(team.password, SALT_ROUNDS)
      }))
    );

    await Team.insertMany(hashedTeams);
    console.log('✅ Teams inserted');

    // =====================
    // INSERT QUESTIONS
    // =====================
    const questions = [
      // ─── Round 1: Red Light Green Light ───
      {
        type: 'redGreen',
        question: 'Enter the secret code to proceed',
        correctAnswer: 'cachemeifyoucan'
      },

      // ─── Round 2: Circle (Logical Reasoning) ───
      {
        type: 'circle',
        question: 'Complete the series: 2, 6, 12, 20, 30, ?',
        correctAnswer: '42'
      },
      {
        type: 'circle',
        question: 'Five years ago, the ratio of A\'s age to B\'s age was 3:4. After 5 years, the ratio will be 5:6. Find A\'s present age.',
        correctAnswer: '15'
      },
      {
        type: 'circle',
        question: 'A can complete a work in 12 days and B in 18 days. They work together for 4 days, then A leaves. How many more days does B need to complete the work?',
        correctAnswer: '8'
      },
      {
        type: 'circle',
        question: 'If 1 → 1, 2 → 4, 3 → 27, 4 → 256, then 5 → ?',
        correctAnswer: '3125'
      },
      {
        type: 'circle',
        question: 'Five friends A, B, C, D, E are sitting in a row. A is not at the end. B is next to C. D is not next to E. Who sits in the middle?',
        correctAnswer: 'C'
      },
      {
        type: 'circle',
        question: 'A bag contains 4 red, 3 blue, and 2 green balls. Two balls are drawn without replacement. What is the probability that both are red?',
        correctAnswer: '1/6'
      },
      {
        type: 'circle',
        question: 'All roses are flowers. Some flowers fade quickly. Which is definitely true?',
        correctAnswer: 'Some flowers are not permanent'
      },
      {
        type: 'circle',
        question: 'A person travels half the distance at 40 km/h and the other half at 60 km/h. What is the average speed?',
        correctAnswer: '48'
      },
      {
        type: 'circle',
        question: 'A two-digit number has digits summing to 9. When reversed, it increases by 27. What is the number?',
        correctAnswer: '36'
      },
      {
        type: 'circle',
        question: 'Complete the pattern: 3, 7, 15, 31, 63, ?',
        correctAnswer: '127'
      },

      // ─── Round 3: Triangle - Python Output ───
      {
        type: 'triangle_python',
        question: 'What is the output of:\n\ndef f(n):\n    if n == 0:\n        return 0\n    return n + f(n-1)\n\nprint(f(5))',
        correctAnswer: '15'
      },
      {
        type: 'triangle_python',
        question: 'What is the output of:\n\ndef f(n):\n    if n <= 1:\n        return 1\n    return f(n-1) * n\n\nprint(f(4))',
        correctAnswer: '24'
      },
      {
        type: 'triangle_python',
        question: 'What is the output of:\n\ndef f(n):\n    if n == 1:\n        return 1\n    return 2 * f(n-1)\n\nprint(f(4))',
        correctAnswer: '8'
      },
      {
        type: 'triangle_python',
        question: 'What is the output of:\n\nx = lambda a: a * 2\nprint(x(5))',
        correctAnswer: '10'
      },
      {
        type: 'triangle_python',
        question: 'What is the output of:\n\ndef f(n):\n    if n == 0:\n        return 1\n    return f(n-1) + 2\n\nprint(f(3))',
        correctAnswer: '7'
      },
      {
        type: 'triangle_python',
        question: 'What is the output of:\n\nfuncs = []\nfor i in range(3):\n    funcs.append(lambda: i)\n\nprint(funcs[0](), funcs[1](), funcs[2]())',
        correctAnswer: '2 2 2'
      },
      {
        type: 'triangle_python',
        question: 'What is the output of:\n\ndef f(n):\n    if n == 0:\n        return 0\n    return n % 2 + f(n//2)\n\nprint(f(6))',
        correctAnswer: '2'
      },
      {
        type: 'triangle_python',
        question: 'What is the output of:\n\ndef f(n):\n    if n < 3:\n        return n\n    return f(n-1) - f(n-2)\n\nprint(f(5))',
        correctAnswer: '1'
      },
      {
        type: 'triangle_python',
        question: 'What is the output of:\n\nx = lambda a,b: a if a>b else b\nprint(x(4,9))',
        correctAnswer: '9'
      },
      {
        type: 'triangle_python',
        question: 'What is the output of:\n\ndef f(n):\n    if n == 1:\n        return 1\n    return n * f(n-1) + 1\n\nprint(f(3))',
        correctAnswer: '10'
      },

      // ─── Round 3: Triangle - C Output ───
      {
        type: 'triangle_c',
        question: 'What is the output of:\n\n#include <stdio.h>\nint main() {\n    int arr[] = {10, 20, 30, 40};\n    int *p = arr;\n    printf("%d", *(p + 2));\n}',
        correctAnswer: '30'
      },
      {
        type: 'triangle_c',
        question: 'What is the output of:\n\n#include <stdio.h>\nint main() {\n    int arr[] = {1, 2, 3, 4};\n    int *p = arr;\n    printf("%d", *p + *(p+3));\n}',
        correctAnswer: '5'
      },
      {
        type: 'triangle_c',
        question: 'What is the output of:\n\n#include <stdio.h>\nint main() {\n    int arr[] = {5, 10, 15};\n    int *p = arr;\n    p++;\n    printf("%d", *p);\n}',
        correctAnswer: '10'
      },
      {
        type: 'triangle_c',
        question: 'What is the output of:\n\n#include <stdio.h>\nint main() {\n    int arr[] = {2, 4, 6, 8};\n    int *p = arr + 1;\n    printf("%d", *(p - 1) + *(p + 1));\n}',
        correctAnswer: '8'
      },
      {
        type: 'triangle_c',
        question: 'What is the output of:\n\n#include <stdio.h>\nint main() {\n    int arr[] = {1,2,3,4,5};\n    int *p = arr;\n    printf("%d", *(p++) + *(++p));\n}',
        correctAnswer: '5'
      },
      {
        type: 'triangle_c',
        question: 'What is the output of:\n\n#include <stdio.h>\nint main() {\n    int arr[3][2] = {{1,2},{3,4},{5,6}};\n    printf("%d", *(*(arr+2)+1));\n}',
        correctAnswer: '6'
      },
      {
        type: 'triangle_c',
        question: 'What is the output of:\n\n#include <stdio.h>\nint main() {\n    int arr[] = {10,20,30,40};\n    int *p = arr;\n    printf("%d", p[1] + p[2]);\n}',
        correctAnswer: '50'
      },
      {
        type: 'triangle_c',
        question: 'What is the output of:\n\n#include <stdio.h>\nint main() {\n    int arr[] = {1,3,5,7};\n    int *p = arr;\n    printf("%d", *(p + (*p)));\n}',
        correctAnswer: '3'
      },
      {
        type: 'triangle_c',
        question: 'What is the output of:\n\n#include <stdio.h>\nint main() {\n    int arr[] = {2,4,6,8};\n    int *p = arr + 3;\n    printf("%d", *(p - 2));\n}',
        correctAnswer: '4'
      },
      {
        type: 'triangle_c',
        question: 'What is the output of:\n\n#include <stdio.h>\nint main() {\n    int arr[] = {5,10,15,20};\n    int *p = arr;\n    printf("%d", *(p+1) * *(p+2));\n}',
        correctAnswer: '150'
      },

      // ─── Round 4: Square (Cows & Bulls - Image based) ───
      {
        type: 'square',
        question: 'Study the Cows & Bulls clues in the image and guess the secret 4-digit number.',
        imageUrl: 'https://res.cloudinary.com/de8hc8le4/image/upload/v1771321965/Screenshot_2026-02-17_at_15.20.39_tfrcwi.png',
        correctAnswer: '3719'
      },

      {
        type: 'square',
        question: 'Study the Cows & Bulls clues in the image and guess the secret 4-digit number.',
        imageUrl: 'https://res.cloudinary.com/de8hc8le4/image/upload/v1771335191/Screenshot_2026-02-17_at_19.02.21_cwqw0y.png ',
        correctAnswer: '9876'
      },


      // ─── Round 5: Umbrella (MCQ) ───
      {
        type: 'mcq',
        question: 'Which of the following number systems uses base 16?',
        options: ['Binary', 'Octal', 'Decimal', 'Hexadecimal'],
        correctAnswer: 'Hexadecimal'
      },
      {
        type: 'mcq',
        question: 'Which data type in C is used to store a single character?',
        options: ['int', 'float', 'char', 'double'],
        correctAnswer: 'char'
      },
      {
        type: 'mcq',
        question: 'What will be the output of: printf("%d", 5/2); in C?',
        options: ['2', '2.5', '3', 'Error'],
        correctAnswer: '2'
      },
      {
        type: 'mcq',
        question: 'Which of the following is not an input device?',
        options: ['Keyboard', 'Mouse', 'Monitor', 'Scanner'],
        correctAnswer: 'Monitor'
      },
      {
        type: 'mcq',
        question: 'Which operator is used for logical AND in C?',
        options: ['&', '&&', '||', '!'],
        correctAnswer: '&&'
      },
      {
        type: 'mcq',
        question: 'Which data structure follows FIFO (First In First Out)?',
        options: ['Stack', 'Queue', 'Array', 'Tree'],
        correctAnswer: 'Queue'
      },
      {
        type: 'mcq',
        question: 'What is the default return type of main() in C?',
        options: ['void', 'int', 'float', 'char'],
        correctAnswer: 'int'
      },
      {
        type: 'mcq',
        question: 'Which loop is guaranteed to execute at least once?',
        options: ['for loop', 'while loop', 'do-while loop', 'infinite loop'],
        correctAnswer: 'do-while loop'
      },
      {
        type: 'mcq',
        question: 'Which of the following is used to declare an array in C?',
        options: ['int arr()', 'int arr[];', 'array int[];', 'arr int[];'],
        correctAnswer: 'int arr[];'
      },
      {
        type: 'mcq',
        question: 'Which component of a computer performs arithmetic and logical operations?',
        options: ['Control Unit', 'ALU', 'RAM', 'Hard Disk'],
        correctAnswer: 'ALU'
      }
      
      
    ];

    await Question.insertMany(questions);
    console.log('✅ Questions inserted');

    console.log('🎉 Database seeding completed successfully');
    console.log('\n📋 Team Credentials:');
    teamsData.forEach(t => console.log(`   ${t.teamId} / ${t.password}`));
    console.log(`\n🔑 Red Light Green Light Password: ${process.env.REDGREEN_PASSWORD || 'cachemeifyoucan'}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
