import { SyllabusSection, SyllabusLevel, Topic } from './types';

// Helper to create topics quickly
const t = (id: string, sectionId: number, title: string, level: SyllabusLevel, hours: number, description: string = ""): Topic => ({
  id,
  sectionId,
  title,
  level,
  estimatedHours: hours,
  description
});

export const SYLLABUS_DATA: SyllabusSection[] = [
  // --- IGCSE 0478 ---
  {
    id: 101,
    title: "Data Representation (IGCSE)",
    level: SyllabusLevel.IGCSE,
    topics: [
      t("i1.1", 101, "Number systems", SyllabusLevel.IGCSE, 5, 
        "Binary, denary and hexadecimal number systems; Conversions between number systems; Use of hexadecimal; Binary addition (8-bit) and overflow; Logical binary shifts; Two's complement for negative 8-bit integers."),
      t("i1.2", 101, "Text, sound and images", SyllabusLevel.IGCSE, 4, 
        "Representation of text (ASCII, Unicode); Representation of sound (sample rate, resolution); Representation of images (pixels, resolution, colour depth)."),
      t("i1.3", 101, "Data storage and compression", SyllabusLevel.IGCSE, 3, 
        "Data storage measurement (bits, bytes, KiB, MiB, etc.); Calculation of file sizes; Purpose of data compression; Lossy vs Lossless compression methods."),
    ]
  },
  {
    id: 102,
    title: "Data Transmission (IGCSE)",
    level: SyllabusLevel.IGCSE,
    topics: [
      t("i2.1", 102, "Types and methods of data transmission", SyllabusLevel.IGCSE, 3, 
        "Packet structure and packet switching; Transmission methods (serial/parallel, simplex/half-duplex/full-duplex); Universal Serial Bus (USB)."),
      t("i2.2", 102, "Methods of error detection", SyllabusLevel.IGCSE, 3, 
        "Errors during transmission; Parity check (odd/even); Checksum; Echo check; Check digits (ISBN, barcodes); Automatic Repeat Query (ARQ)."),
      t("i2.3", 102, "Encryption", SyllabusLevel.IGCSE, 2, 
        "Purpose of encryption; Symmetric vs Asymmetric encryption (public/private keys)."),
    ]
  },
  {
    id: 103,
    title: "Hardware (IGCSE)",
    level: SyllabusLevel.IGCSE,
    topics: [
      t("i3.1", 103, "Computer architecture", SyllabusLevel.IGCSE, 5, 
        "CPU role and components (ALU, CU, Registers, Buses); Von Neumann architecture; Fetch-Decode-Execute cycle; Cores, cache and clock speed; Instruction sets; Embedded systems."),
      t("i3.2", 103, "Input and output devices", SyllabusLevel.IGCSE, 4, 
        "Input devices (scanners, cameras, keyboards, microphones, sensors); Output devices (actuators, projectors, printers, screens, speakers, 3D printers); Sensors and their applications."),
      t("i3.3", 103, "Data storage (Hardware)", SyllabusLevel.IGCSE, 4, 
        "Primary storage (RAM, ROM); Secondary storage (Magnetic, Optical, Solid-state); Virtual memory; Cloud storage (advantages/disadvantages)."),
      t("i3.4", 103, "Network hardware", SyllabusLevel.IGCSE, 2, 
        "Network Interface Card (NIC); MAC addresses; IP addresses (IPv4, IPv6, static/dynamic); Routers."),
    ]
  },
  {
    id: 104,
    title: "Software (IGCSE)",
    level: SyllabusLevel.IGCSE,
    topics: [
      t("i4.1", 104, "Types of software and interrupts", SyllabusLevel.IGCSE, 4, 
        "System vs Application software; Operating System functions (file, memory, peripheral, user management); Interrupts (hardware/software)."),
      t("i4.2", 104, "Programming languages & Translators", SyllabusLevel.IGCSE, 4, 
        "High-level vs Low-level languages (Assembly); Translators (Assembler, Compiler, Interpreter); Integrated Development Environments (IDEs)."),
    ]
  },
  {
    id: 105,
    title: "The Internet and its uses (IGCSE)",
    level: SyllabusLevel.IGCSE,
    topics: [
      t("i5.1", 105, "Internet and World Wide Web", SyllabusLevel.IGCSE, 4, 
        "Difference between Internet and WWW; URLs; HTTP/HTTPS; Web browsers; Cookies (session, persistent)."),
      t("i5.2", 105, "Digital Currency", SyllabusLevel.IGCSE, 2, 
        "Concept of digital currency; Blockchain technology and tracking transactions."),
      t("i5.3", 105, "Cyber Security", SyllabusLevel.IGCSE, 4, 
        "Cyber threats (brute-force, data interception, DDoS, hacking, malware, phishing, pharming, social engineering); Solutions (access levels, anti-malware, authentication, firewalls, proxy servers, SSL)."),
    ]
  },
  {
    id: 106,
    title: "Automated & Emerging Tech (IGCSE)",
    level: SyllabusLevel.IGCSE,
    topics: [
      t("i6.1", 106, "Automated systems", SyllabusLevel.IGCSE, 3, 
        "Sensors, microprocessors and actuators in automation; Advantages and disadvantages in scenarios (industry, transport, agriculture, etc.)."),
      t("i6.2", 106, "Robotics", SyllabusLevel.IGCSE, 2, 
        "Characteristics of robots; Roles in industry, transport, agriculture, medicine, domestic; Advantages/Disadvantages."),
      t("i6.3", 106, "Artificial Intelligence", SyllabusLevel.IGCSE, 3, 
        "Characteristics of AI (data collection, rules, reasoning, learning); Expert systems; Machine learning."),
    ]
  },
  {
    id: 107,
    title: "Algorithm design & Problem-solving (IGCSE)",
    level: SyllabusLevel.IGCSE,
    topics: [
      t("i7.1", 107, "Program development life cycle", SyllabusLevel.IGCSE, 2, 
        "Analysis, design, coding, testing."),
      t("i7.2", 107, "Decomposition and Design", SyllabusLevel.IGCSE, 4, 
        "Sub-systems; Decomposition; Structure diagrams; Flowcharts; Pseudocode."),
      t("i7.3", 107, "Standard methods of solution", SyllabusLevel.IGCSE, 5, 
        "Linear search; Bubble sort; Totalling; Counting; Finding max/min/average."),
      t("i7.4", 107, "Validation and Verification", SyllabusLevel.IGCSE, 3, 
        "Validation checks (range, length, type, presence, format, check digit); Verification checks (visual, double entry)."),
      t("i7.5", 107, "Testing and Trace tables", SyllabusLevel.IGCSE, 5, 
        "Test data (normal, abnormal, boundary, extreme); Dry runs using trace tables; Identifying errors."),
    ]
  },
  {
    id: 108,
    title: "Programming (IGCSE)",
    level: SyllabusLevel.IGCSE,
    topics: [
      t("i8.1", 108, "Programming Concepts", SyllabusLevel.IGCSE, 10, 
        "Variables, constants, data types (Integer, Real, Char, String, Boolean); Input/Output; Sequence, Selection (IF, CASE), Iteration (FOR, REPEAT, WHILE); String handling; Operators; Procedures and Functions; Library routines."),
      t("i8.2", 108, "Arrays", SyllabusLevel.IGCSE, 5, 
        "1D and 2D arrays; Declaration, usage, index variables; Nested iteration for arrays."),
      t("i8.3", 108, "File handling", SyllabusLevel.IGCSE, 3, 
        "Reading from and writing to files; Opening/closing files."),
    ]
  },
  {
    id: 109,
    title: "Databases (IGCSE)",
    level: SyllabusLevel.IGCSE,
    topics: [
      t("i9.1", 109, "Databases", SyllabusLevel.IGCSE, 6, 
        "Single-table databases; Fields, records; Data types; Primary keys; SQL scripts (SELECT, FROM, WHERE, ORDER BY, SUM, COUNT)."),
    ]
  },
  {
    id: 110,
    title: "Boolean Logic (IGCSE)",
    level: SyllabusLevel.IGCSE,
    topics: [
      t("i10.1", 110, "Boolean Logic", SyllabusLevel.IGCSE, 6, 
        "Logic gate symbols (NOT, AND, OR, NAND, NOR, XOR); Logic functions; Truth tables; Logic circuits and expressions."),
    ]
  },

  // --- AS LEVEL (9618) ---
  {
    id: 1,
    title: "Information Representation",
    level: SyllabusLevel.AS,
    topics: [
      t("1.1", 1, "Data Representation (Binary, Hex, BCD)", SyllabusLevel.AS, 3, 
        "Understand how data is represented in computer systems. Content includes: Binary, Denary, and Hexadecimal conversions; benefits of Hexadecimal; Binary Coded Decimal (BCD) usage; Two's complement for signed integers; Character sets (ASCII, Unicode)."),
      t("1.2", 1, "Multimedia (Graphics, Sound)", SyllabusLevel.AS, 3, 
        "Representation of multimedia data. Content includes: Bitmap images (pixel, resolution, colour depth, file header); Vector graphics (drawing list, properties); Sound (analogue vs digital, sampling rate, sampling resolution, file size calculations)."),
      t("1.3", 1, "Compression (Lossy, Lossless)", SyllabusLevel.AS, 2, 
        "Techniques to reduce file sizes. Content includes: Lossless compression (Run-length encoding - RLE); Lossy compression algorithms; Application of compression to text, bitmap images, vector graphics, and sound files."),
    ]
  },
  {
    id: 2,
    title: "Communication",
    level: SyllabusLevel.AS,
    topics: [
      t("2.1", 2, "Networks including the internet", SyllabusLevel.AS, 5, 
        "Networking fundamentals. Content includes: LAN vs WAN; Client-server vs Peer-to-peer models; Thin vs Thick clients; Network topologies (Bus, Star, Mesh, Hybrid); Cloud computing (Private, Public, Hybrid); Wired vs Wireless transmission (Copper, Fibre, Radio, Microwaves, Satellites); IP addresses (IPv4, IPv6, Static, Dynamic); DNS and URL structure."),
    ]
  },
  {
    id: 3,
    title: "Hardware",
    level: SyllabusLevel.AS,
    topics: [
      t("3.1", 3, "Computers and their components", SyllabusLevel.AS, 4, 
        "Understanding internal hardware. Content includes: The need for input, output, primary and secondary storage; Embedded systems; RAM vs ROM; Buffer usage; Hardware devices (Touch screens, Printers, Speakers, Cameras, Sensors, Magnetic/Optical/Solid-state storage)."),
      t("3.2", 3, "Logic Gates and Logic Circuits", SyllabusLevel.AS, 4, 
        "Digital logic basics. Content includes: Logic gates (NOT, AND, OR, NAND, NOR, XOR); Truth tables; Constructing logic circuits from problem statements; Writing Boolean expressions from circuits and vice versa."),
    ]
  },
  {
    id: 4,
    title: "Processor Fundamentals",
    level: SyllabusLevel.AS,
    topics: [
      t("4.1", 4, "CPU Architecture (Von Neumann)", SyllabusLevel.AS, 3, 
        "The Von Neumann model. Content includes: CPU components (ALU, CU, IAS, Registers including PC, MAR, MDR, CIR, ACC); System Buses (Address, Data, Control); The Fetch-Execute Cycle; Register Transfer Notation; Interrupt handling."),
      t("4.2", 4, "Assembly Language", SyllabusLevel.AS, 5, 
        "Low-level programming. Content includes: Relationship between Assembly and Machine code; LMC (Little Man Computer) instruction set; Symbolic addressing; Absolute, Immediate, Indexed, Indirect, and Relative addressing modes; Tracing assembly programs."),
      t("4.3", 4, "Bit manipulation", SyllabusLevel.AS, 3, 
        "Operations on binary data. Content includes: Logical shifts (Left, Right); Cyclic shifts; Arithmetic shifts; Using masks with AND, OR, XOR for setting, clearing, and testing bits."),
    ]
  },
  {
    id: 5,
    title: "System Software",
    level: SyllabusLevel.AS,
    topics: [
      t("5.1", 5, "Operating Systems", SyllabusLevel.AS, 3, 
        "Role of the OS. Content includes: Management of hardware, memory, signals, and scheduling; Interface provisions; Utility software (Disk formatter, Virus checker, Defragmenter, File compression, Backup)."),
      t("5.2", 5, "Language Translators", SyllabusLevel.AS, 2, 
        "Translating code. Content includes: Assemblers, Compilers, and Interpreters (differences, benefits, drawbacks); Application of translators; Integrated Development Environment (IDE) features (Coding, Translation, Debugging)."),
    ]
  },
  {
    id: 6,
    title: "Security, privacy and data integrity",
    level: SyllabusLevel.AS,
    topics: [
      t("6.1", 6, "Data Security", SyllabusLevel.AS, 2, 
        "Protecting data. Content includes: Threats (Malware, Hacking, Phishing, Pharming, Denial of Service); Methods of protection (Passwords, Biometrics, Firewalls, Proxy servers, Encryption, Anti-malware)."),
      t("6.2", 6, "Data Integrity", SyllabusLevel.AS, 2, 
        "Ensuring data accuracy. Content includes: Difference between Security and Integrity; Validation (Range, Format, Length, Presence, Type, Check digit); Verification (Double entry, Visual check)."),
    ]
  },
  {
    id: 7,
    title: "Ethics and Ownership",
    level: SyllabusLevel.AS,
    topics: [
      t("7.1", 7, "Ethics and Ownership", SyllabusLevel.AS, 2, 
        "Professional responsibilities. Content includes: Copyright legislation; Software licensing (Free Software Foundation, Open Source, Shareware, Commercial); AI ethics; Professional codes of conduct (IEEE, ACM, BCS)."),
    ]
  },
  {
    id: 8,
    title: "Databases",
    level: SyllabusLevel.AS,
    topics: [
      t("8.1", 8, "Database Concepts", SyllabusLevel.AS, 3, 
        "Relational database design. Content includes: Flat files vs Relational databases; Entities and Attributes; Primary, Foreign, Candidate, and Secondary keys; Entity-Relationship (E-R) diagrams; Normalisation (1NF, 2NF, 3NF)."),
      t("8.2", 8, "DBMS", SyllabusLevel.AS, 2, 
        "Database Management Systems. Content includes: Role of DBMS; Data dictionary; Logical and Physical schemas; Developer interface vs Query processor."),
      t("8.3", 8, "DDL and DML (SQL)", SyllabusLevel.AS, 4, 
        "Structured Query Language. Content includes: DDL (CREATE DATABASE, CREATE TABLE, ALTER TABLE, PRIMARY/FOREIGN KEY); DML (SELECT, FROM, WHERE, ORDER BY, GROUP BY, INNER JOIN, INSERT INTO, UPDATE, DELETE)."),
    ]
  },
  {
    id: 9,
    title: "Algorithm Design & Problem-solving",
    level: SyllabusLevel.AS,
    topics: [
      t("9.1", 9, "Computational Thinking Skills", SyllabusLevel.AS, 2, 
        "Approaches to problem solving. Content includes: Abstraction (filtering details); Decomposition (breaking down problems); Data modelling; Pattern recognition."),
      t("9.2", 9, "Algorithms", SyllabusLevel.AS, 5, 
        "Writing and tracing algorithms. Content includes: Structured English; Pseudocode format; Flowcharts; Tracing algorithms with Trace Tables; Standard algorithms (Linear search, Bubble sort, Insertion sort); Using ADTs (Stacks, Queues, Linked Lists) in algorithms."),
    ]
  },
  {
    id: 10,
    title: "Data Types and Structures",
    level: SyllabusLevel.AS,
    topics: [
      t("10.1", 10, "Data Types and Records", SyllabusLevel.AS, 2, 
        "Programming data types. Content includes: Integer, Real, Char, String, Boolean, Date; Composite user-defined data types (Records)."),
      t("10.2", 10, "Arrays (1D, 2D)", SyllabusLevel.AS, 3, 
        "Array manipulation. Content includes: Declaration and usage of 1D and 2D arrays; Iterating through arrays; Linear search implementation."),
      t("10.3", 10, "Files", SyllabusLevel.AS, 2, 
        "File handling. Content includes: Opening, Closing, Reading from and Writing to Text and Binary files."),
      t("10.4", 10, "Introduction to ADT", SyllabusLevel.AS, 2, 
        "Abstract Data Types concepts. Content includes: Understanding Stacks (LIFO), Queues (FIFO), and Linked Lists; Basic operations (push, pop, enqueue, dequeue, add, remove)."),
    ]
  },
  {
    id: 11,
    title: "Programming",
    level: SyllabusLevel.AS,
    topics: [
      t("11.1", 11, "Programming Basics", SyllabusLevel.AS, 3, 
        "Writing code. Content includes: Variable and Constant declaration; Input/Output; Assignments; Sequencing."),
      t("11.2", 11, "Constructs", SyllabusLevel.AS, 4, 
        "Control structures. Content includes: Selection (IF-THEN-ELSE, CASE/SWITCH); Iteration (Count-controlled/FOR, Pre-condition/WHILE, Post-condition/REPEAT-UNTIL)."),
      t("11.3", 11, "Structured Programming", SyllabusLevel.AS, 3, 
        "Modular programming. Content includes: Procedures vs Functions; Parameters (Passing by Value vs Reference); Local vs Global variables; Recursion basics."),
    ]
  },
  {
    id: 12,
    title: "Software Development",
    level: SyllabusLevel.AS,
    topics: [
      t("12.1", 12, "Program Development Life cycle", SyllabusLevel.AS, 2, 
        "The lifecycle. Content includes: Analysis (Abstraction, Decomposition); Design; Coding; Testing; Maintenance. Models: Waterfall, Iterative, RAD."),
      t("12.2", 12, "Program Design", SyllabusLevel.AS, 2, 
        "Design tools. Content includes: Structure charts; State-transition diagrams; Pseudocode."),
      t("12.3", 12, "Program Testing and Maintenance", SyllabusLevel.AS, 3, 
        "Ensuring quality. Content includes: Syntax, Logic, and Runtime errors; Test data (Normal, Abnormal, Boundary, Extreme); White-box vs Black-box testing; Stub testing; Maintenance (Corrective, Perfective, Adaptive)."),
    ]
  },
  // --- A LEVEL (9618) ---
  {
    id: 13,
    title: "Data Representation (A Level)",
    level: SyllabusLevel.A,
    topics: [
      t("13.1", 13, "User-defined data types", SyllabusLevel.A, 2, 
        "Advanced data types. Content includes: Non-composite types (Enumerated, Pointer); Composite types (Set, Record, Class/Object)."),
      t("13.2", 13, "File organisation and access", SyllabusLevel.A, 2, 
        "File storage methods. Content includes: Serial, Sequential, Random access files; Hashing algorithms for direct access."),
      t("13.3", 13, "Floating-point numbers", SyllabusLevel.A, 4, 
        "Real number representation. Content includes: Normalisation; Precision vs Range; Overflow and Underflow; Binary representation of floating-point numbers."),
    ]
  },
  {
    id: 14,
    title: "Communication & Internet Tech",
    level: SyllabusLevel.A,
    topics: [
      t("14.1", 14, "Protocols", SyllabusLevel.A, 3, 
        "Network standards. Content includes: The TCP/IP Protocol Suite (Four layers); Protocols: HTTP, FTP, POP3, IMAP, SMTP, BitTorrent."),
      t("14.2", 14, "Circuit switching, packet switching", SyllabusLevel.A, 2, 
        "Data transmission methods. Content includes: Circuit switching mechanics; Packet switching structure and routing (routers)."),
    ]
  },
  {
    id: 15,
    title: "Hardware & Virtual Machines",
    level: SyllabusLevel.A,
    topics: [
      t("15.1", 15, "Processors, Parallel Processing, VMs", SyllabusLevel.A, 4, 
        "Advanced Architecture. Content includes: RISC vs CISC; Pipelining and hazards; Parallel processing (SISD, SIMD, MISD, MIMD); Massive parallel computers; Virtual Machines."),
      t("15.2", 15, "Boolean Algebra and Logic Circuits", SyllabusLevel.A, 4, 
        "Advanced Logic. Content includes: Boolean Algebra laws (De Morgan's, etc.); Karnaugh Maps (K-maps) for simplification; Half and Full Adders; Flip-flops (SR, JK)."),
    ]
  },
  {
    id: 16,
    title: "System Software (A Level)",
    level: SyllabusLevel.A,
    topics: [
      t("16.1", 16, "Purposes of an Operating System", SyllabusLevel.A, 3, 
        "OS Internals. Content includes: Scheduling (Round Robin, FCFS, SJF, SRT); Virtual Memory (Paging, Segmentation, Thrashing); Spooling and Interrupt handling."),
      t("16.2", 16, "Translation Software", SyllabusLevel.A, 3, 
        "Compiler stages. Content includes: Lexical Analysis (Tokens); Syntax Analysis (Parsing); Code Generation; Optimization."),
    ]
  },
  {
    id: 17,
    title: "Security (A Level)",
    level: SyllabusLevel.A,
    topics: [
      t("17.1", 17, "Encryption, Protocols, Certs", SyllabusLevel.A, 4, 
        "Advanced Security. Content includes: Symmetric vs Asymmetric Encryption; Public/Private keys; Digital Signatures; Digital Certificates; SSL/TLS protocols."),
    ]
  },
  {
    id: 18,
    title: "Artificial Intelligence",
    level: SyllabusLevel.A,
    topics: [
      t("18.1", 18, "Artificial Intelligence", SyllabusLevel.A, 5, 
        "AI concepts. Content includes: AI Graphs; Dijkstra's Algorithm; A* Algorithm; Machine Learning; Deep Learning; Neural Networks (Layers, Back propagation, Weights)."),
    ]
  },
  {
    id: 19,
    title: "Computational thinking & Problem-solving",
    level: SyllabusLevel.A,
    topics: [
      t("19.1", 19, "Algorithms (A Level)", SyllabusLevel.A, 5, 
        "Advanced Algorithms. Content includes: Binary Search; Recursive Sorting (Merge Sort, Quick Sort); Abstract Data Type implementation (Linked List, Stack, Queue, Binary Tree, Hash Table)."),
      t("19.2", 19, "Recursion", SyllabusLevel.A, 3, 
        "Recursive thinking. Content includes: Defining recursive functions; Base cases; Tracing recursive calls; Stack usage in recursion."),
    ]
  },
  {
    id: 20,
    title: "Further Programming",
    level: SyllabusLevel.A,
    topics: [
      t("20.1", 20, "Programming Paradigms", SyllabusLevel.A, 4, 
        "Programming styles. Content includes: Object-Oriented Programming (Classes, Objects, Inheritance, Polymorphism, Containment, Encapsulation, Getters/Setters); Declarative Programming."),
      t("20.2", 20, "File Processing and Exception Handling", SyllabusLevel.A, 4, 
        "Robust programming. Content includes: Exception handling (Try-Catch); Random access file processing; Serialization."),
    ]
  },
];

export const FLATTENED_TOPICS = SYLLABUS_DATA.flatMap(s => s.topics);