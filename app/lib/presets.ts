import { Scenario } from './types';

export const axumPreset: Scenario = {
  backgroundImage: '/images/axum.png',
  title: 'The Conversion of Axum',
  description:
    'It is 340 CE in the Kingdom of Axum, one of the great powers of the ancient world. King Ezana must decide whether to adopt Christianity as the state religion — a decision that will reshape the Horn of Africa for millennia.',
  historicalContext:
    'The Kingdom of Axum (modern Ethiopia/Eritrea) controls vital Red Sea trade routes connecting Rome, India, and Arabia. Christianity has been spreading through merchant networks, and the Roman Empire under Constantine has recently embraced it. Axum\'s traditional religion centers on the god Mahrem, but Jewish, Christian, and pagan communities coexist in the kingdom.',
  timePeriod: '340 CE, Kingdom of Axum',
  centralQuestion: 'Should King Ezana convert the Kingdom of Axum to Christianity?',
  votingOptions: [
    { id: 'convert', label: 'Convert to Christianity', votes: 0 },
    { id: 'traditional', label: 'Maintain traditional religion', votes: 0 },
    { id: 'pluralism', label: 'Adopt religious pluralism', votes: 0 },
  ],
  stages: [
    {
      id: 'opening',
      type: 'freeform',
      title: 'Opening Discussion',
      description:
        'Students introduce their characters and share initial positions on the question of conversion.',
      durationSeconds: 300,
    },
    {
      id: 'debate',
      type: 'debate',
      title: 'The Great Debate',
      description:
        'Structured arguments for and against conversion. Each side presents their strongest case.',
      durationSeconds: 600,
    },
    {
      id: 'npc-react',
      type: 'npc_response',
      title: 'The Court Responds',
      description:
        'Key figures at the Axumite court react to the arguments they have heard.',
      durationSeconds: 180,
    },
    {
      id: 'final-speeches',
      type: 'speech',
      title: 'Final Appeals',
      description:
        'Last chance for students to make their case before the vote.',
      durationSeconds: 300,
    },
    {
      id: 'vote',
      type: 'vote',
      title: 'The King Decides',
      description: 'The class votes on what King Ezana should do.',
      durationSeconds: 120,
    },
    {
      id: 'verdict',
      type: 'verdict',
      title: 'The Verdict',
      description:
        'NPCs react to the decision, and the historical outcome is revealed.',
      durationSeconds: 300,
    },
  ],
  npcs: [
    {
      id: 'ezana',
      name: 'King Ezana',
      title: 'Negus of Axum, King of Kings',
      personality:
        'Shrewd and ambitious, Ezana is a young ruler who inherited the throne as a child. He is deeply pragmatic about power but also genuinely curious about spiritual matters. He weighs decisions carefully, always considering how they affect Axum\'s standing among the great kingdoms.',
      historicalContext:
        'Ezana rules over a prosperous trading kingdom. He was tutored by Frumentius, a Christian from Tyre. His coins initially bore the disc and crescent of traditional religion before switching to the cross.',
      stance:
        'Genuinely torn. Sees political advantages in Christianity (alliance with Rome) but worries about alienating traditionalist nobles and priests.',
      avatarEmoji: '👑',
      voice: 'onyx',
    },
    {
      id: 'frumentius',
      name: 'Frumentius',
      title: 'Bishop of Axum, Apostle of Ethiopia',
      personality:
        'Passionate, eloquent, and deeply devout. Frumentius was shipwrecked on the Axumite coast as a young man and rose to become tutor to the royal children. He genuinely loves Axum and its people, and believes Christianity will bring them salvation and prosperity.',
      historicalContext:
        'Originally from Tyre (modern Lebanon), Frumentius was consecrated as Bishop of Axum by Athanasius of Alexandria. He has spent decades building a Christian community in Axum.',
      stance:
        'Strongly pro-conversion. Argues that Christianity is the true faith, that it will strengthen ties with Rome and Egypt, and that it brings moral clarity.',
      avatarEmoji: '✝️',
      voice: 'fable',
    },
    {
      id: 'highpriest',
      name: ' Wagri',
      title: 'High Priest of Mahrem',
      personality:
        'Proud, traditional, and deeply connected to Axumite heritage. Wagri sees the traditional religion as inseparable from Axumite identity and power. He is suspicious of foreign influences and fears that conversion will destroy ancient practices.',
      historicalContext:
        'The cult of Mahrem (god of war) is central to Axumite royal legitimacy. The king traditionally claims descent from Mahrem. The priestly class controls important temples and rituals.',
      stance:
        'Strongly against conversion. Argues that abandoning Mahrem means abandoning Axumite identity, angering the gods, and submitting to foreign religious authority.',
      avatarEmoji: '⚡',
      voice: 'echo',
    },
  ],
  historicalOutcome:
    'King Ezana did convert to Christianity around 330-340 CE, making Axum one of the first states in the world to adopt Christianity as its official religion. His coins changed from displaying the disc and crescent to the cross. The Ethiopian Orthodox Church became one of the oldest Christian institutions in the world, profoundly shaping Ethiopian culture, art, and politics for over 1,600 years. However, traditional practices were not immediately eliminated — they blended with Christianity in complex ways that scholars still study today.',
};
