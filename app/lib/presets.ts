import { Scenario } from './types';

export const teotihuacanPreset: Scenario = {
  slug: 'fire-on-the-avenue-of-the-dead',
  backgroundImage: '/images/teotihuacan.png',
  introBannerImage: '/images/teotihuacan-intro.png',
  introNarrative:
    'The smoke still rises from the Avenue of the Dead. Where the great temples once stood crowned in painted stucco and obsidian, only blackened walls remain. The fires were not random \u2014 they burned the temples, the elite residences, the administrative halls. But the apartment compounds where a hundred thousand people live are untouched. Someone chose what to burn.',
  mode: 'education',
  category: 'history',
  title: 'The Fire on the Avenue of the Dead',
  description:
    'It is approximately 550 CE in Teotihuacan, the greatest city in the Americas. A devastating fire has swept the ceremonial center, destroying temples along the Avenue of the Dead. The city of over 100,000 people now faces an existential crisis: was this an act of internal revolt, divine punishment, or enemy attack? The ruling order must decide the city\'s future.',
  context:
    'Teotihuacan, located in the Basin of Mexico, has been the dominant power in Mesoamerica for centuries. At its height around 450 CE, it housed perhaps 125,000-150,000 people in a carefully planned urban grid, making it one of the largest cities in the world. The city\'s influence stretched from the Maya lowlands to western Mexico, spread through trade networks, military prestige, and religious authority centered on the worship of the Feathered Serpent (later known as Quetzalcoatl), the Great Goddess, the Storm God (Tlaloc), and the Old God of Fire. Around 550 CE, archaeological evidence shows that the city\'s ceremonial center was deliberately and systematically burned — temples, elite residences, and administrative buildings along the Avenue of the Dead were torched. Crucially, ordinary residential compounds were largely spared. This selective destruction strongly suggests an internal uprising against the ruling theocratic elite, though external factors like drought and the disruption of trade routes to the Maya region may have contributed. The city\'s art conspicuously avoids depicting individual rulers, suggesting a corporate or collective form of governance that may have fractured under stress. Apartment compounds housed multi-ethnic populations including Zapotec, Maya, and Gulf Coast communities, each with their own barrio.',
  setting: 'c. 550 CE, Teotihuacan',
  centralQuestion: 'After the burning of the temples, what should be the political future of Teotihuacan?',
  votingOptions: [
    { id: 'restore', label: 'Restore the temples and reinstate the old theocratic order', votes: 0 },
    { id: 'reform', label: 'Reform governance — share power with merchant and military councils', votes: 0 },
    { id: 'disperse', label: 'Acknowledge decline and begin planned dispersal to new settlements', votes: 0 },
  ],
  stages: [
    {
      id: 'opening',
      type: 'freeform',
      title: 'Opening Accounts',
      description:
        'Introduce your character and describe what you witnessed during the fires. Share your account of who was responsible and what it means for the city.',
      durationSeconds: 300,
    },
    {
      id: 'debate',
      type: 'debate',
      title: 'The Council Debates',
      description:
        'Representatives of the city\'s factions debate the path forward. Should Teotihuacan rebuild its temples and reassert divine authority, restructure its government, or accept that the city\'s age of dominance is ending?',
      durationSeconds: 600,
    },
    {
      id: 'npc-react',
      type: 'npc_response',
      title: 'Outside Reactions',
      description:
        'Foreign envoys and spiritual authorities react to the arguments and reveal outside pressures on the city.',
      durationSeconds: 180,
    },
    {
      id: 'final-speeches',
      type: 'speech',
      title: 'Final Appeals to the Assembly',
      description:
        'Last chance for each faction to make their case before the assembly votes on the city\'s future.',
      durationSeconds: 300,
    },
    {
      id: 'vote',
      type: 'vote',
      title: 'The Assembly Decides',
      description: 'The assembly votes on the political future of Teotihuacan.',
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
  roles: [
    {
      id: 'high-priest',
      name: 'Ixtan',
      title: 'High Priest of the Feathered Serpent Temple',
      description:
        'The senior surviving priest of the Temple of the Feathered Serpent (Ciudadela). Ixtan has to defend the old religious order that gave him power while acknowledging the legitimate grievances that may have sparked the fires. He can argue that without divine sanction and ritual order, the city will collapse entirely — the gods must be appeased. But he must also explain why the gods allowed the destruction in the first place. Trained in astronomical observation and calendar keeping, he controls knowledge that is essential to agriculture and trade.',
      suggestedFor: 'ta',
      assignedTo: '',
    },
    {
      id: 'merchant-leader',
      name: 'Copaltzin',
      title: 'Head of the Obsidian Merchants\' Guild',
      description:
        'Leader of Teotihuacan\'s most powerful trade network. The city\'s obsidian workshops supply tools and weapons across Mesoamerica, and Copaltzin controls the distribution. She argues that the theocratic elite hoarded wealth while trade routes deteriorated, and that merchants and artisans — who actually generate the city\'s prosperity — deserve a seat at the governing table. Pragmatic and well-traveled, she has contacts in Monte Albán, Tikal, and Cholula, and knows that the city\'s competitors are watching this crisis closely.',
      suggestedFor: 'student',
      assignedTo: '',
    },
    {
      id: 'military-commander',
      name: 'Yaotl',
      title: 'Commander of the Eagle Warriors',
      description:
        'The chief military officer responsible for defending the city and its trade routes. Yaotl is furious about the fire — whether it was set by internal rebels or external enemies, it represents a catastrophic security failure. He argues that the city needs strong centralized military authority to prevent further chaos, protect against opportunistic attacks from rival cities, and maintain control over the obsidian sources in the Sierra de las Navajas. He is suspicious of the priests but also wary of merchant ambitions.',
      suggestedFor: 'student',
      assignedTo: '',
    },
  ],
  npcs: [
    {
      id: 'maya-envoy',
      name: 'K\'inich Bahlam',
      title: 'Envoy from Tikal',
      personality:
        'K\'inich Bahlam presents himself as a concerned ally but is quietly assessing whether Teotihuacan\'s decline creates opportunities for Tikal. He speaks with elaborate courtesy. He remembers the "Entrada" of 378 CE, when Teotihuacan-affiliated warriors overthrew Tikal\'s dynasty — an intervention that still shapes Maya politics. His attitude toward Teotihuacan mixes old resentment with real respect.',
      context:
        'In 378 CE, a figure called Siyaj K\'ahk\' ("Fire Is Born"), likely a Teotihuacan general, arrived at Tikal and overthrew its king, installing a new dynasty with Teotihuacan connections. This event, called the "Entrada," shows Teotihuacan\'s massive reach into the Maya world. By 550 CE, however, Teotihuacan\'s grip on Maya affairs had weakened considerably. Tikal\'s leaders would be closely watching the crisis, weighing whether to maintain their old alliance or assert independence.',
      stance:
        'Officially expresses concern and offers diplomatic support, but privately assesses whether Tikal should distance itself from Teotihuacan. Suggests that the fire reveals the gods\' displeasure with Teotihuacan\'s rulers — subtly undermining the old order while appearing sympathetic.',
      avatarEmoji: '🐆',
      voice: 'echo',
    },
    {
      id: 'priestess',
      name: 'Citlalmina',
      title: 'Elder Priestess of the Great Goddess',
      personality:
        'Citlalmina speaks in riddles and metaphors drawn from the natural world — spiders, caves, water, jade. She represents the oldest religious traditions of Teotihuacan, centered on the mysterious "Great Goddess" depicted in the murals of Tepantitla. She is not aligned with the male priestly hierarchy of the Feathered Serpent temple and may see the fire as a necessary purification. The common people and the apartment compound communities revere her.',
      context:
        'The "Great Goddess" of Teotihuacan is one of the most debated figures in Mesoamerican studies. Depicted in elaborate murals with spiders, jaguars, and water imagery, she appears to be a powerful female deity — possibly a goddess of fertility, water, the earth, or the underworld. Some scholars argue she represents a political-religious authority separate from the Feathered Serpent cult. Her worship may have been more popular among ordinary residents than the elite-controlled temple cults. The Tepantitla murals show her presiding over a paradise of abundance.',
      stance:
        'Cryptically suggests the fire was a divine act of cleansing — the old order was corrupt, and the Great Goddess demands renewal. Does not directly endorse any political faction but implies the common people and the apartment compound communities should have more voice. Warns that rebuilding the old temples without reforming the social order will only invite another catastrophe.',
      avatarEmoji: '🕷️',
      voice: 'shimmer',
    },
  ],
  outcome:
    'Teotihuacan never recovered its former glory after the fires of c. 550 CE. The archaeological evidence is striking: the burning was selective and deliberate, targeting elite and ceremonial structures while largely sparing residential apartment compounds. This pattern strongly suggests an internal uprising against the ruling theocratic elite rather than a foreign attack. After the fire, the city entered a long decline. Population dropped dramatically over the following century, from perhaps 125,000 to around 30,000-40,000 by 650 CE. The apartment compounds continued to be inhabited, but the great temples were never rebuilt to their former scale. Political and economic power fragmented, with former Teotihuacan satellite sites like Cholula, Xochicalco, and Cacaxtla emerging as independent regional powers. Trade networks that had funneled wealth into the city broke apart. When the Aztecs encountered the ruins centuries later, they named it "Teotihuacan" — "the place where the gods were created" — believing that only divine beings could have built such a city. The memory of Teotihuacan profoundly shaped later Mesoamerican civilizations: the Aztecs modeled their own capital Tenochtitlan partly on its grid plan, and the Feathered Serpent cult continued at Cholula and elsewhere for nearly a thousand years. The lesson of Teotihuacan\'s fall — that even the mightiest city can be brought down by internal inequality and elite overreach — resonated through Mesoamerican political thought.',
};

export const axumPreset: Scenario = {
  slug: 'conversion-of-axum',
  backgroundImage: '/images/axum.png',
  introBannerImage: '/images/axum-intro.png',
  introNarrative:
    'The incense smoke curls upward from the altar of Mahrem, god of war and patron of kings. But today, King Ezana does not kneel before the old stone idol. He stands at the window of the royal palace, looking out over the city \u2014 the obelisks of his ancestors tower over new churches where hymns are sung in Greek.',
  mode: 'education',
  category: 'history',
  title: 'The Conversion of Axum',
  description:
    'It is 340 CE in the Kingdom of Axum, one of the great powers of the ancient world. King Ezana must decide whether to adopt Christianity as the state religion — a decision that will reshape the Horn of Africa for millennia.',
  context:
    'The Kingdom of Axum (modern Ethiopia/Eritrea) controls vital Red Sea trade routes connecting Rome, India, and Arabia. Christianity has been spreading through merchant networks. The Roman Empire under Constantine recently embraced it, and his successor Constantius II is now pressuring neighboring kingdoms to follow suit — though Constantius favors the Arian interpretation of Christianity, which conflicts with the Nicene Christianity taught by Frumentius. Axum\'s traditional religion centers on a pantheon including Mahrem (god of war and the royal dynasty), Beher (god of the sea), Meder (god of the earth), and Astar (a deity akin to Venus). The king claims divine descent from Mahrem, and a powerful priestly class maintains temples and rituals. Jewish communities are also present in the region, adding another dimension to the religious landscape.',
  setting: '340 CE, Kingdom of Axum',
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
        'Introduce your character and declare your initial position on the question of conversion. What do you stand to gain or lose?',
      durationSeconds: 300,
    },
    {
      id: 'debate',
      type: 'debate',
      title: 'The Debate',
      description:
        'Structured arguments for and against conversion. Each side presents their strongest case.',
      durationSeconds: 600,
    },
    {
      id: 'npc-react',
      type: 'npc_response',
      title: 'The Court Responds',
      description:
        'The Roman envoy and the Queen Mother react to the arguments they have heard.',
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
  roles: [
    {
      id: 'ezana',
      name: 'King Ezana',
      title: 'Negus of Axum, King of Kings',
      description:
        'The decision-maker. Moderates the debate, asks probing questions of both sides, and ultimately casts the deciding voice. Ezana is a young, shrewd ruler who inherited the throne as a child. He was tutored by the Christian Frumentius but also raised in the traditional religion. He must weigh spiritual conviction against political pragmatism — conversion could strengthen ties with Rome, but alienate the powerful traditionalist nobility.',
      suggestedFor: 'ta',
      assignedTo: '',
    },
    {
      id: 'frumentius',
      name: 'Frumentius',
      title: 'Bishop of Axum, Apostle of Ethiopia',
      description:
        'The chief advocate for conversion. Originally from Tyre (modern Lebanon), Frumentius was shipwrecked on the Axumite coast as a young man and rose to become tutor to the royal children. He traveled to Alexandria, where Patriarch Athanasius consecrated him as Bishop of Axum. He has spent decades building a Christian community. He argues that Christianity is the true faith, will bring moral clarity, and will strengthen Axum\'s alliance with Rome and Egypt.',
      suggestedFor: 'student',
      assignedTo: '',
    },
    {
      id: 'highpriest',
      name: 'High Priest of Mahrem',
      title: 'Chief Priest of the Royal War God',
      description:
        'The chief advocate against conversion. Represents the traditional Axumite priesthood and the cult of Mahrem, god of war, from whom the royal dynasty claims descent. Argues that abandoning the traditional gods — Mahrem, Beher, Meder, Astar — means abandoning Axumite identity, severing the king\'s divine legitimacy, and destroying the temples and rituals that have sustained the kingdom for centuries. Fears that conversion means submitting to foreign religious authority from Alexandria.',
      suggestedFor: 'student',
      assignedTo: '',
    },
  ],
  npcs: [
    {
      id: 'roman-envoy',
      name: 'Flavius Theophilus',
      title: 'Envoy of Emperor Constantius II',
      personality:
        'Theophilus presents himself as a friend of Axum but always advances Roman imperial interests. He is an Arian Christian — he believes the Son is subordinate to the Father, putting him at odds with the Nicene Christianity of Frumentius and Athanasius. He undermines Frumentius while still pushing for conversion, showing that even among Christians there is sharp disagreement.',
      context:
        'Emperor Constantius II, Constantine\'s son and an Arian Christian, historically wrote a letter to Ezana demanding that Frumentius be sent to Alexandria to be "re-examined" by the Arian bishop George of Cappadocia. Ezana refused. This envoy represents that real diplomatic pressure — Rome wants Axum to convert, but on Rome\'s theological terms, not Alexandria\'s.',
      stance:
        'Favors conversion, but wants Axum to adopt Arian Christianity aligned with the Emperor, not the Nicene Christianity of Frumentius and Athanasius. Applies political pressure: alliance with Rome brings trade and military benefits, but Rome expects theological compliance.',
      avatarEmoji: '🦅',
      avatarImage: '/images/flavius.png',
      voice: 'onyx',
    },
    {
      id: 'queen-mother',
      name: 'Queen Mother Sofya',
      title: 'Queen Mother and Royal Advisor',
      personality:
        'Sofya has navigated court politics for decades and survived the regency period after her husband\'s death. She speaks with the authority of someone who has held real power. Not easily swayed by theological arguments — she wants to know the practical consequences. Protective of Ezana but willing to challenge him.',
      context:
        'While the specific identity of Ezana\'s mother is not well documented, queen mothers held significant political influence in Axumite court politics, particularly during regencies. The role represents the domestic political dimension of the conversion decision — the internal power dynamics that a foreign religion would disrupt.',
      stance:
        'Cautious and pragmatic. Not opposed to Christianity in principle, but worried about the pace and consequences of conversion. What happens to the noble families tied to the old temples? Will the common people accept this? Could a compromise — tolerating Christianity without making it official — preserve stability?',
      avatarEmoji: '👸',
      avatarImage: '/images/queenmother.png',
      voice: 'nova',
    },
  ],
  outcome:
    'King Ezana did convert to Christianity around 330-340 CE, making Axum one of the first states in the world to adopt Christianity as its official religion. His coins changed from displaying the disc and crescent of the traditional gods to the cross. When Emperor Constantius II sent a letter demanding that Frumentius be sent to Alexandria for "re-examination" by an Arian bishop, Ezana refused — asserting Axum\'s religious independence from Rome. The Ethiopian Orthodox Church, tied to the Alexandrian (Coptic) tradition, became one of the oldest Christian institutions in the world, profoundly shaping Ethiopian culture, art, and politics for over 1,600 years. However, traditional practices were not immediately eliminated — they blended with Christianity in complex ways that scholars still study today. The old gods faded slowly, and elements of pre-Christian belief persisted in folk practice for centuries.',
};

export const pompeiiPreset: Scenario = {
  slug: 'plinys-decision-at-misenum',
  backgroundImage: '/images/pompeii.png',
  introNarrative:
    'It begins as a curiosity. A column of smoke rises from Vesuvius, shaped like an umbrella pine. But within the hour, the sky goes dark and the first hot stones begin to fall. Then a message arrives from a woman trapped at the foot of the volcano, begging the fleet for rescue.',
  mode: 'education',
  category: 'history',
  title: "Pliny's Decision at Misenum",
  description:
    'It is the afternoon of August 24, 79 CE. A strange cloud shaped like an umbrella pine has risen from Mount Vesuvius, visible from the naval base at Misenum across the Bay of Naples. Admiral Gaius Plinius Secundus — Pliny the Elder — commands the Roman imperial fleet. As ash begins to fall and desperate messages arrive from the coast, he must decide: should the fleet sail toward the eruption to attempt a rescue?',
  context:
    'Pliny the Elder (23-79 CE) was one of the most remarkable figures of the Roman world: a naval commander, natural philosopher, and author of the encyclopedic Natural History in 37 volumes. As prefect of the Misene fleet (praefectus classis Misenensis), he commanded the largest naval squadron in the Roman Empire, stationed at Misenum on the northern arm of the Bay of Naples. On August 24, 79 CE, his seventeen-year-old nephew Pliny the Younger was studying with him when they observed an enormous eruption column rising from Vesuvius. The elder Pliny initially wanted to investigate as a scientist, but when he received a desperate message from Rectina, a friend trapped near the volcano, he ordered the fleet to launch a rescue mission. The eruption of Vesuvius in 79 CE was a complex, multi-phase event. It began with a Plinian eruption column reaching 33 km into the stratosphere, raining pumice and ash. After roughly 12 hours, the column collapsed, generating pyroclastic surges — superheated clouds of gas, ash, and rock traveling at up to 700 km/h — that destroyed Herculaneum and eventually Pompeii. The coastal waters were disrupted by the eruption, with unusual wave patterns and the sea retreating in places, exposing the harbor floor.',
  setting: 'August 24, 79 CE, Misenum, Bay of Naples',
  centralQuestion: 'Should Admiral Pliny order the fleet to sail toward Vesuvius to attempt a rescue?',
  votingOptions: [
    { id: 'full-fleet', label: 'Launch the full fleet — duty and honor demand it', votes: 0 },
    { id: 'squadron', label: 'Send a small rescue squadron; keep the main fleet safe', votes: 0 },
    { id: 'wait', label: 'Wait for the eruption to subside before acting', votes: 0 },
    { id: 'refuse', label: 'Refuse — the danger is too great', votes: 0 },
  ],
  stages: [
    {
      id: 'opening',
      type: 'freeform',
      title: 'Opening Reactions',
      description:
        'Introduce your character and describe your reaction to the eruption. What do you see? What do the omens tell you? Urge the admiral toward action or caution.',
      durationSeconds: 300,
    },
    {
      id: 'debate',
      type: 'debate',
      title: 'The Debate',
      description:
        'The admiral convenes his officers and advisors aboard the flagship. Should the fleet sail toward the eruption? The debate intensifies as conditions worsen and desperate pleas arrive from shore.',
      durationSeconds: 600,
      events: [
        {
          id: 'rectina-letter',
          text: "Rectina's Letter Arrives",
          description:
            'A small boat reaches the flagship carrying a wax tablet from Rectina, a noblewoman trapped in a villa at the foot of Vesuvius. She begs Pliny for rescue — there is no escape by land, and the falling stones grow larger by the hour. "Only the fleet can save us now."',
          minDelay: 30,
          maxDelay: 90,
          probability: 0.9,
        },
        {
          id: 'pumice-rain',
          text: 'Pumice Rain Begins',
          description:
            'Hot pumice stones begin falling on the harbor at Misenum itself, clattering on decks and rooftops. The stones are light but scorching. Sailors scramble to cover exposed equipment. If the rain is reaching Misenum, 30 kilometers away, conditions near the volcano must be catastrophic.',
          minDelay: 120,
          maxDelay: 210,
          probability: 0.8,
        },
        {
          id: 'column-collapse',
          text: 'The Column Collapses',
          description:
            'The towering eruption cloud, which has been rising steadily for hours, suddenly collapses. A grey-black wave of superheated material surges down the mountainside toward Herculaneum at terrifying speed. Anyone in its path has no chance of survival. The scope of the disaster has changed completely.',
          minDelay: 240,
          maxDelay: 360,
          probability: 0.7,
        },
        {
          id: 'sea-retreats',
          text: 'The Sea Retreats',
          description:
            'The harbor water begins to recede unnaturally, exposing the muddy sea floor. Fish flop on exposed rocks. Experienced sailors recognize this as an ominous sign — the sea often retreats before surging back. Navigation near the coast will be treacherous and unpredictable.',
          minDelay: 330,
          maxDelay: 450,
          probability: 0.6,
        },
      ],
    },
    {
      id: 'npc-react',
      type: 'npc_response',
      title: 'Eyewitness Responses',
      description:
        'Rectina and the senior trierarch respond to the arguments, bringing the human cost and practical realities into sharp focus.',
      durationSeconds: 180,
    },
    {
      id: 'final-speeches',
      type: 'speech',
      title: 'Final Arguments',
      description:
        'Last chance for each side to make their case. The eruption grows worse as speakers plead their positions.',
      durationSeconds: 300,
      events: [
        {
          id: 'darkness-falls',
          text: 'Darkness Falls',
          description:
            'Though it is still afternoon, the sky goes black as the ash cloud blots out the sun. Torches and oil lamps are hastily lit across the fleet. The unnatural darkness feels apocalyptic — some sailors fall to their knees praying to Neptune and Vulcan. Time is running out.',
          minDelay: 60,
          maxDelay: 180,
          probability: 0.75,
        },
        {
          id: 'survivors-arrive',
          text: 'Survivors Arrive',
          description:
            'A badly damaged fishing boat limps into the harbor, crewed by ash-covered survivors from the coast near Herculaneum. They bring terrible news: buildings are collapsing under the weight of pumice, the air is becoming unbreathable, and hundreds of people are trapped on the beaches with nowhere to go.',
          minDelay: 120,
          maxDelay: 240,
          probability: 0.65,
        },
      ],
    },
    {
      id: 'vote',
      type: 'vote',
      title: "The Admiral's Decision",
      description: 'The class votes on what Admiral Pliny should do with the fleet.',
      durationSeconds: 120,
    },
    {
      id: 'verdict',
      type: 'verdict',
      title: 'The Verdict',
      description:
        'The NPCs react to the decision, and the historical outcome is revealed.',
      durationSeconds: 300,
    },
  ],
  roles: [
    {
      id: 'pliny-elder',
      name: 'Pliny the Elder',
      title: 'Admiral of the Misene Fleet, Natural Philosopher',
      description:
        'Gaius Plinius Secundus commands the most powerful naval force in the Roman Empire. A lifelong scholar and author of the encyclopedic Natural History, he is driven by scientific curiosity and a strong sense of Roman duty (officium). He initially wants to investigate the eruption as a natural phenomenon but is torn when rescue becomes the priority. He moderates the debate, weighing the arguments of his nephew, his officers, and the desperate pleas from shore. Known for his famous motto: "Fortune favors the brave" (Fortes fortuna iuvat).',
      suggestedFor: 'ta',
      assignedTo: '',
    },
    {
      id: 'pliny-younger',
      name: 'Pliny the Younger',
      title: 'Nephew of the Admiral, age 17',
      description:
        'Gaius Plinius Caecilius Secundus is seventeen years old and studying rhetoric under his uncle\'s guidance. Brilliant but cautious, he argues against sailing into danger. He fears for his uncle\'s life and believes the fleet should wait for conditions to improve. He represents the voice of prudence and survival. Historically, he stayed behind at Misenum and survived to write the only ancient eyewitness accounts of the eruption — two letters to the historian Tacitus that became foundational documents in volcanology.',
      suggestedFor: 'student',
      assignedTo: '',
    },
    {
      id: 'pomponianus',
      name: 'Gaius Pomponianus',
      title: 'Friend of Pliny, resident of Stabiae',
      description:
        'A wealthy Roman living at Stabiae, south of Vesuvius across the bay. He has already packed his belongings onto a ship, ready to flee if the wind changes. He argues passionately for immediate rescue — his friends and neighbors are in mortal danger, and the Roman fleet exists precisely for moments like this. He appeals to Roman honor, military duty, and the bonds of friendship (amicitia). Historically, Pliny eventually reached Stabiae and stayed at Pomponianus\'s villa, where Pliny died of toxic fumes on the beach the next morning.',
      suggestedFor: 'student',
      assignedTo: '',
    },
  ],
  npcs: [
    {
      id: 'rectina',
      name: 'Rectina',
      title: 'Noblewoman trapped near Vesuvius',
      personality:
        'Rectina speaks with the authority of a Roman matron of high status — she is not begging, she is demanding what is owed to Roman citizens by their navy. Her messages become increasingly urgent as conditions worsen. She makes the crisis personal, bringing the debate back to the people actually trapped and dying.',
      context:
        'Rectina is mentioned by Pliny the Younger in his letter to Tacitus (Epistulae VI.16) as having sent a message to Pliny the Elder begging for rescue. She was "terrified by the danger threatening her — for her villa lay at the foot of Vesuvius, and there was no escape except by boat." Her message was the catalyst that transformed Pliny\'s expedition from scientific observation to a full rescue mission. Some scholars identify her as the wife of Tascius Pomponianus, though this is debated.',
      stance:
        'Desperately advocates for immediate rescue. Every moment of debate is a moment where people are dying. The fleet must sail now — not tomorrow, not when conditions improve, NOW. Appeals to Roman duty, the obligations of patronage, and basic humanity.',
      avatarEmoji: '🏛️',
      voice: 'nova',
    },
    {
      id: 'trierarch',
      name: 'Trierarch Marcus Aelius',
      title: 'Senior Captain of the Fleet',
      personality:
        'Marcus Aelius has commanded warships for twenty years across the Mediterranean. He speaks bluntly, without the rhetorical flourishes of the educated elite. He respects Admiral Pliny but is alarmed by the conditions — falling stones, unpredictable seas, and ash reducing visibility to near zero. He knows what his ships can and cannot do, and he will not sugarcoat the risks to his crews.',
      context:
        'The Misene fleet (Classis Misenensis) was one of two major imperial fleets based in Italy, consisting of large warships (quadriremes and triremes) as well as lighter Liburnian galleys. A trierarch was the captain of an individual warship. The fleet had roughly 10,000 sailors and marines. While primarily a military force, the fleet also served civilian functions including transport and, in emergencies, evacuation. The ships were oar-powered galleys that could navigate independently of wind but were vulnerable to falling debris and shallow, disrupted waters.',
      stance:
        'Cautiously pragmatic. Does not refuse the mission but insists on honesty about the risks. The lighter Liburnian galleys might reach the coast, but the heavy quadriremes risk grounding in disrupted waters. If the admiral orders the fleet out, Marcus Aelius will obey — but he wants everyone to understand that ships and crews may be lost. Recommends a smaller rescue force rather than the entire fleet.',
      avatarEmoji: '⚓',
      voice: 'onyx',
    },
  ],
  outcome:
    'Pliny the Elder did sail. He ordered the full fleet to launch, reportedly declaring "Fortes fortuna iuvat" — Fortune favors the brave. He initially headed for Rectina\'s villa but found landing impossible due to falling debris and the altered shoreline. He diverted south to Stabiae, where his friend Pomponianus had a villa. There, Pliny tried to calm the terrified household, bathing and dining as if nothing were wrong. He fell asleep (or lost consciousness) and had to be woken when the courtyard began filling with pumice, threatening to block the doors. The group fled to the beach with pillows tied to their heads against the falling stones. But the sea was too rough to launch, and toxic volcanic gases — likely sulfur dioxide and carbon dioxide — rolled across the shore. Pliny, who suffered from respiratory problems, collapsed and died on the beach on the morning of August 25. His body was found two days later, intact, "looking more like a man asleep than dead," according to his nephew. Pliny the Younger, who had stayed behind at Misenum, survived the eruption and later wrote two extraordinary letters to the historian Tacitus describing both his uncle\'s death and his own harrowing experience as the eruption reached Misenum itself. These letters (Epistulae VI.16 and VI.20) became the only surviving ancient eyewitness account of a major volcanic eruption and are so detailed that volcanologists named the eruption type "Plinian" in his honor. The eruption killed an estimated 16,000 people and buried Pompeii, Herculaneum, Stabiae, and Oplontis under meters of volcanic material.',
};

export const plagueCambridgePreset: Scenario = {
  slug: 'pestilence-at-cambridge',
  backgroundImage: '/images/plague-cambridge.png',
  introBannerImage: '/images/plague-cambridge-intro.png',
  introNarrative:
    'At first the bells tolled one by one. Now they ring almost without pause. Carts creak toward churchyards with shrouded bodies; near Bene\'t Street, people whisper that pits are being opened for the dead. At St John\'s, even the masters have begun to die. Some scholars flee by horse or boat. The poor cannot. In the market, men speak of corrupted air, divine punishment, and the end of the world. The mayor has called an emergency council. Cambridge must choose what kind of order it will keep as half the town seems to be vanishing.',
  mode: 'education',
  category: 'history',
  difficulty: 'intermediate',
  participantRange: { min: 5, max: 30 },
  title: 'The Pestilence at Cambridge',
  description:
    'It is late May 1349, and the Black Death is near its peak in Cambridge. Priests are dying, St John\'s Hospital is overwhelmed, scholars are slipping away, and ordinary burial customs are starting to break under the strain. Town and university leaders must decide what Cambridge will protect first when there are not enough healthy hands to do everything.',
  context:
    'Fourteenth-century Cambridge was a small but unusually complex town of perhaps 4,000-6,000 people, divided between ordinary townsfolk and the growing university community. The Black Death appears to have reached Cambridge around Easter 1349, and the worst mortality likely fell between mid-April and late June. Modern historians working from episcopal records, wills, college evidence, and burial archaeology suggest that perhaps half the town died. Priests perished in large numbers, creating a crisis of confession, last rites, and burial. St John\'s Hospital, which cared for the poor and sick, lost multiple masters in quick succession. Many victims were buried in ordinary parish churchyards, but emergency burial also occurred, including the plague pit later excavated near Bene\'t Street. The parish of All Saints by the Castle was so devastated that it was eventually abandoned and merged with another parish. People did not understand germs; they explained plague through corrupted air, divine punishment, unlucky conjunctions of the heavens, and the moral condition of the community. Cambridge\'s leaders now face a brutal problem: scarce priests, carts, laborers, grain, and civic officers cannot cover every need at once.',
  setting: 'Late May 1349, Cambridge',
  centralQuestion:
    'As plague peaks in Cambridge, which priority should govern the next two weeks: proper rites, emergency relief, or institutional survival?',
  votingOptions: [
    {
      id: 'rites',
      label: 'Prioritize parish rites and ordinary burial',
      description:
        'Keep surviving clergy, carts, and labor focused on confession, last rites, and burial in consecrated ground, even if food relief and civic routines suffer.',
      votes: 0,
    },
    {
      id: 'relief',
      label: 'Prioritize relief and emergency measures',
      description:
        'Redirect labor toward food, nursing, and rapid burial, accepting disrupted ritual, suspended routines, and looser spiritual procedures when clergy cannot cope.',
      votes: 0,
    },
    {
      id: 'continuity',
      label: 'Prioritize continuity and protect essential institutions',
      description:
        'Protect officers, records, and the healthiest clergy and scholars so Cambridge can still govern, teach, and recover afterward, even if many households receive less help now.',
      votes: 0,
    },
  ],
  stages: [
    {
      id: 'opening',
      type: 'freeform',
      title: 'The Bells Do Not Stop',
      description:
        'Introduce your character, describe what you have seen in Cambridge during the last week, and declare what the town must protect first as mortality climbs.',
      durationSeconds: 300,
    },
    {
      id: 'debate',
      type: 'debate',
      title: 'The Emergency Council',
      description:
        'Cambridge cannot fully maintain proper rites and burial, feed and tend the stricken, and preserve its town and university institutions all at once. Argue which good must come first, and what painful sacrifices the other two priorities will require.',
      durationSeconds: 600,
      events: [
        {
          id: 'parish-priest-dies',
          text: 'Another Parish Priest Dies',
          description:
            'Word arrives that a nearby parish priest has died overnight. Dozens of households are now begging for confession, last rites, and burial from clergy who are already exhausted and frightened.',
          minDelay: 30,
          maxDelay: 120,
          probability: 0.9,
        },
        {
          id: 'benet-street-burials',
          text: 'Burials Expand Near Bene\'t Street',
          description:
            'Gravediggers report that ordinary churchyard space is running short, and extra ground near Bene\'t Street is being opened for clustered burials. Some call this practical necessity; others call it a scandal against Christian order.',
          minDelay: 120,
          maxDelay: 240,
          probability: 0.85,
        },
        {
          id: 'st-johns-crisis',
          text: 'St John\'s Hospital Falters',
          description:
            'A messenger from St John\'s reports that another master is sick and the hospital cannot feed, wash, and house everyone now gathering at its gates. The poor are beginning to sleep outside.',
          minDelay: 210,
          maxDelay: 330,
          probability: 0.8,
        },
        {
          id: 'scholars-flee',
          text: 'Scholars and Officers Begin to Flee',
          description:
            'Hostels are emptying. Some scholars, clerks, and better-off townspeople are leaving Cambridge by road and river. If too many officers vanish, who will keep seals, accounts, wills, and court business from collapsing?',
          minDelay: 300,
          maxDelay: 450,
          probability: 0.75,
        },
      ],
    },
    {
      id: 'npc-react',
      type: 'npc_response',
      title: 'Voices from the Edge',
      description:
        'A dying townsman, a hospital servant, and a bishop\'s clerk respond to the debate, forcing the council to face the human, spiritual, and administrative cost of its choice.',
      durationSeconds: 180,
    },
    {
      id: 'final-speeches',
      type: 'speech',
      title: 'Final Appeals',
      description:
        'Make your last appeal to the council. What duty comes first now: salvation, bodily survival, or preserving enough order for Cambridge to endure after the mortality?',
      durationSeconds: 300,
      events: [
        {
          id: 'extraordinary-confession',
          text: 'Extraordinary Spiritual Measures Are Allowed',
          description:
            'Word comes from church authorities that extraordinary measures may be permitted when priests cannot reach every dying person in time. Some see mercy in this; others hear a confession that the old order is failing.',
          minDelay: 45,
          maxDelay: 160,
          probability: 0.8,
        },
        {
          id: 'town-clerk-ill',
          text: 'The Town Clerk Falls Ill',
          description:
            'The town clerk is reported feverish. Without clerks, seals, and sworn officers, wills, inheritances, grain contracts, and guardianship disputes may become chaos even if the plague soon ebbs.',
          minDelay: 120,
          maxDelay: 220,
          probability: 0.7,
        },
      ],
    },
    {
      id: 'vote',
      type: 'vote',
      title: 'The Council Chooses',
      description: 'The council decides which priority will govern Cambridge for the next two weeks.',
      durationSeconds: 120,
    },
    {
      id: 'verdict',
      type: 'verdict',
      title: 'The Historical Outcome',
      description:
        'NPCs react to the decision, and the historical fate of Cambridge in the plague year is revealed.',
      durationSeconds: 300,
    },
  ],
  roles: [
    {
      id: 'mayor',
      name: 'The Mayor',
      title: 'Mayor of Cambridge',
      description:
        'Presides over the emergency council. Responsible for civic order, markets, labor, and the increasingly strained peace between town and university. The mayor is not choosing between good and evil, but between three goods that can no longer all be protected at once. Press every speaker to explain exactly whose suffering their policy accepts.',
      suggestedFor: 'ta',
      assignedTo: '',
    },
    {
      id: 'hospital-master',
      name: 'Master of St John\'s',
      title: 'Master of St John\'s Hospital',
      description:
        'Oversees the hospital serving poor and sick residents on the edge of town. Knows from direct experience that there are not enough beds, servants, candles, or broth for everyone now seeking help. Argues that Cambridge must redirect labor and carts toward food, nursing, and rapid burial, even if ordinary routines and cherished customs are disrupted.',
      suggestedFor: 'student',
      assignedTo: '',
    },
    {
      id: 'parish-priest',
      name: 'Parish Priest',
      title: 'Rector of All Saints by the Castle',
      description:
        'Represents one of the most heavily stricken parishes in Cambridge. Insists that confession, last rites, and burial in consecrated ground are not luxuries but essential duties owed to the dying. Fears that if Cambridge relaxes sacred obligations in the name of efficiency, it will wound souls, scandalize the town, and invite even worse divine judgment.',
      suggestedFor: 'student',
      assignedTo: '',
    },
    {
      id: 'regent-master',
      name: 'Regent Master',
      title: 'University Master from King\'s Hall',
      description:
        'Speaks for the university community, where scholars and clerks are dying or fleeing. Argues that Cambridge must preserve enough educated clergy, officers, and records to govern, teach, administer property, and rebuild after the mortality. Knows this position sounds cold, but warns that a town that lets its institutions collapse will punish survivors for years.',
      suggestedFor: 'student',
      assignedTo: '',
    },
    {
      id: 'guild-alderman',
      name: 'Guild Alderman',
      title: 'Merchant and Grain Factor',
      description:
        'Connected to the market, river traffic, and the town\'s supply of bread and ale. Believes panic itself can become a killer if carts stop moving and prices spike. Can support relief or continuity depending on the flow of debate, but always presses a hard practical question: who will still deliver food if the town tells healthy people to risk death for no clear plan?',
      suggestedFor: 'student',
      assignedTo: '',
    },
    {
      id: 'townswoman',
      name: 'Townswoman',
      title: 'Widowed Householder from All Saints Parish',
      description:
        'Represents ordinary residents who cannot escape to country manors or distant relatives. Her household needs food, help with the sick, and assurance that the dead will not simply disappear into a ditch. She is suspicious of elite talk about preserving institutions if that means abandoning common families, but she also knows terrifying disorder when she sees it.',
      suggestedFor: 'student',
      assignedTo: '',
    },
  ],
  npcs: [
    {
      id: 'dickon',
      name: 'Dickon',
      title: 'A sick townsman from All Saints by the Castle',
      personality:
        'Feverish, frightened, and plainspoken. Dickon does not speak in policy language. He speaks about pain, about his wife not knowing how to feed the children, and about the terror of dying without confession or a known grave.',
      context:
        'Dickon is based on a real individual reconstructed by the After the Plague project from Cambridge evidence. He appears to have lived in the parish of All Saints by the Castle and likely died in the plague year of 1349. His presence grounds the debate in the experience of ordinary townspeople rather than institutions alone.',
      stance:
        'Demands that the council remember what plague feels like from the bed of the sick. He wants food and care for his household, but he is equally terrified of dying without confession or a known Christian burial. He resists any policy that treats the dying poor as expendable in order to preserve comfort for the healthy.',
      avatarEmoji: '🕯️',
      voice: 'fable',
    },
    {
      id: 'marion',
      name: 'Marion',
      title: 'Lay servant at St John\'s Hospital',
      personality:
        'Exhausted, blunt, and unsentimental. Marion has washed bodies, carried broth, and watched respectable men debate while servants do the worst work. She has no patience for rhetoric that ignores the number of hands actually available.',
      context:
        'Marion is a historically plausible composite based on the staff and lay servants who would have kept St John\'s Hospital functioning as long as it could during the plague. Hospitals in medieval towns depended on a fragile mix of clergy, servants, charity, and food supply; when even a few key people died, the whole system staggered.',
      stance:
        'Strongly favors relief and emergency measures. If clergy, carts, candles, and food are all short, then Cambridge must stop pretending normal customs can be preserved intact and instead direct resources where they will do the most immediate good.',
      avatarEmoji: '🍞',
      voice: 'nova',
    },
    {
      id: 'alan-of-ely',
      name: 'Alan of Ely',
      title: 'Clerk carrying instructions from the bishop\'s officials',
      personality:
        'Careful, educated, and uneasy. Alan tries to sound composed, but he has seen how quickly legal and spiritual routines are breaking down across the diocese. He weighs words because he knows any concession can sound like surrender.',
      context:
        'Alan is a composite ecclesiastical official modeled on the clerks who transmitted episcopal instructions during the Black Death. As plague killed priests in large numbers, bishops and archbishops issued extraordinary guidance on confession, ordination, cemeteries, and pastoral care in an effort to keep the church functioning under impossible conditions.',
      stance:
        'Insists that Cambridge cannot simply set aside confession and burial because they have become difficult. Extraordinary measures may be necessary, but only as a last resort; the first duty is still to give the dying some recognizable form of spiritual care and Christian burial. He can be persuaded that some institutional preservation is necessary, but only if it clearly serves that sacramental duty rather than replacing it.',
      avatarEmoji: '📜',
      voice: 'onyx',
    },
  ],
  outcome:
    'No emergency policy could have spared Cambridge from the Black Death. The town was hit hard in 1349, with the worst mortality concentrated in a matter of weeks after Easter. Modern historians working from local and diocesan evidence argue that perhaps half the town died. Priests, hospital personnel, scholars, and ordinary laborers all perished in alarming numbers. St John\'s Hospital lost masters in rapid succession; the parish of All Saints by the Castle was so devastated that it was later abandoned and merged with another parish. Most victims still seem to have been buried in churchyards, but emergency burial also occurred, including the plague pit near Bene\'t Street. Cambridge survived, and the university survived, but both emerged diminished, altered, and more conscious than ever that ordinary institutions depend on fragile human labor. The plague did not simply kill individuals. It forced medieval communities to decide, under impossible pressure, what they owed the dying, the living, and the future.',
};

export const trolleyPreset: Scenario = {
  slug: 'trolley-problem-tribunal',
  backgroundImage: '/images/trolley.png',
  introBannerImage: '/images/trolley-intro.png',
  introNarrative:
    'Picture it clearly. A runaway trolley, brakes failed, hurtling down the track toward five people who cannot move. You are standing next to a lever. Pull it, and the trolley diverts to a side track \u2014 where one person stands. Do nothing, and five die. Act, and one dies by your hand. The mathematics seem simple. But something in you hesitates. Why?',
  mode: 'education',
  category: 'philosophy',
  difficulty: 'introductory',
  participantRange: { min: 4, max: 30 },
  title: 'The Trolley Problem Tribunal',
  description:
    'A runaway trolley is barreling toward five people tied to the tracks. You stand next to a lever that can divert it to a side track — but one person is tied there. Then the scenarios escalate: what if you must push someone off a bridge? What if the one person is a child? A panel of moral philosophers, a trauma surgeon, and a railroad safety engineer must help the audience navigate the most famous thought experiment in ethics.',
  context:
    'The trolley problem was introduced by British philosopher Philippa Foot in 1967 and refined by Judith Jarvis Thomson in 1985. It has become the most widely discussed thought experiment in moral philosophy because it exposes a sharp tension between two dominant ethical frameworks: utilitarianism (which says we should maximize the total good — save five, sacrifice one) and deontological ethics (which says some actions are inherently wrong regardless of outcome — using a person as a means to an end violates their dignity). The experiment has real-world applications in autonomous vehicle programming, medical triage, military rules of engagement, and public health resource allocation. Psychological research by Joshua Greene using fMRI imaging has shown that the "lever" and "footbridge" variants activate different brain regions: the impersonal lever scenario engages rational calculation, while the personal push scenario triggers emotional moral intuition. This suggests that our moral judgments are not purely rational but involve competing cognitive systems.',
  setting: 'A university ethics seminar',
  centralQuestion: 'Is it morally permissible to divert the trolley, killing one person to save five?',
  votingOptions: [
    { id: 'pull', label: 'Pull the lever — saving five lives outweighs one', votes: 0 },
    { id: 'dont-pull', label: 'Do not pull — killing by action is worse than letting die', votes: 0 },
    { id: 'depends', label: 'It depends on context — no universal rule applies', votes: 0 },
  ],
  stages: [
    {
      id: 'opening',
      type: 'freeform',
      title: 'The Dilemma',
      description:
        'Share your initial gut reaction: pull the lever or not? Explain the reasoning behind your snap judgment. The panel will ask probing questions to surface hidden assumptions.',
      durationSeconds: 300,
    },
    {
      id: 'debate',
      type: 'debate',
      title: 'The Debate',
      description:
        'Structured debate between utilitarian and deontological positions. The scenario escalates: what about the footbridge variant, where you must physically push someone? What changes, and why?',
      durationSeconds: 600,
    },
    {
      id: 'npc-react',
      type: 'npc_response',
      title: 'Expert Testimony',
      description:
        'The moral philosophers and the trauma surgeon respond to the arguments they have heard, introducing complications the students may not have considered.',
      durationSeconds: 180,
    },
    {
      id: 'final-speeches',
      type: 'speech',
      title: 'Final Positions',
      description:
        'Participants stake out their final positions. Have the escalating scenarios changed anyone\'s mind? Can anyone articulate a consistent principle that handles all variants?',
      durationSeconds: 300,
    },
    {
      id: 'vote',
      type: 'vote',
      title: 'The Vote',
      description: 'The audience votes on the original dilemma.',
      durationSeconds: 120,
    },
    {
      id: 'verdict',
      type: 'verdict',
      title: 'The Verdict',
      description:
        'The panel delivers closing thoughts and the real-world implications are discussed.',
      durationSeconds: 300,
    },
  ],
  roles: [
    {
      id: 'moderator',
      name: 'The Moderator',
      title: 'Seminar Leader',
      description:
        'Guides the discussion, introduces each variant of the trolley problem in sequence (lever, footbridge, loop track, transplant surgeon), and ensures both sides get equal time. Should play devil\'s advocate — if the room leans utilitarian, press with deontological challenges, and vice versa. Key task: make sure the conversation moves beyond "gut feelings" to articulated principles.',
      suggestedFor: 'ta',
      assignedTo: '',
    },
    {
      id: 'utilitarian',
      name: 'The Utilitarian Advocate',
      title: 'Defender of the Greatest Good',
      description:
        'Argues that the morally correct action is always the one that produces the best overall outcome. Pulling the lever saves a net four lives — the math is clear. Must defend this position even when the scenarios get uncomfortable: if pushing one fat man off a bridge saves five, the utilitarian logic still holds. Can cite Jeremy Bentham, John Stuart Mill, and Peter Singer.',
      suggestedFor: 'student',
      assignedTo: '',
    },
    {
      id: 'deontologist',
      name: 'The Kantian Objector',
      title: 'Defender of Moral Rules',
      description:
        'Argues that using any person merely as a means to save others is inherently wrong, regardless of the outcome. There is a moral distinction between killing and letting die, between diverting harm and directly causing it. Can cite Immanuel Kant\'s categorical imperative, the doctrine of double effect (Thomas Aquinas), and the distinction between intended and foreseen consequences. Must explain why the footbridge case feels different from the lever case — and why that feeling matters.',
      suggestedFor: 'student',
      assignedTo: '',
    },
  ],
  npcs: [
    {
      id: 'foot',
      name: 'Professor Foot',
      title: 'Moral Philosopher',
      personality:
        'Never gives her own answer — instead asks the question that makes the previous answer collapse. Speaks with quiet British understatement. Takes special interest in why people change their answers between the lever and footbridge cases. Believes the trolley problem reveals something important about moral psychology, not just moral philosophy.',
      context:
        'Based on Philippa Foot, who introduced the trolley problem in her 1967 paper "The Problem of Abortion and the Doctrine of the Double Effect." Foot was one of the founders of modern virtue ethics and spent her career at Oxford and UCLA. She was interested in the trolley problem not as a puzzle to be solved but as a tool for revealing the structure of moral reasoning — particularly the distinction between doing and allowing.',
      stance:
        'Does not take a side. Instead, probes both positions for weaknesses. Presses utilitarians: "If five need organ transplants, may we harvest one healthy person?" Presses deontologists: "If you truly believe inaction is neutral, would you refuse to flip a switch that diverts a missile from a city?" Wants participants to find the limits of their own principles.',
      avatarEmoji: '🎓',
      voice: 'shimmer',
    },
    {
      id: 'surgeon',
      name: 'Dr. Amara Osei',
      title: 'Trauma Surgeon',
      personality:
        'Has made real triage decisions under pressure — who gets the last ventilator, which patient goes to surgery first when there aren\'t enough surgeons. Brings the conversation back to earth whenever it gets too theoretical. Not hostile to philosophy, but insists that real moral decisions happen in seconds, not seminars.',
      context:
        'Represents the practical dimension of trolley-problem reasoning. Emergency medicine and disaster triage involve genuine utilitarian calculations: when resources are scarce, doctors must decide who to treat first based on who can be saved and at what cost. The military equivalent is battlefield triage. These real-world parallels show that the trolley problem is not purely academic — similar logic shapes medical ethics, organ transplant allocation, and pandemic resource distribution.',
      stance:
        'Leans utilitarian in practice — "In my ER, I save the most lives I can with what I have" — but acknowledges that the footbridge variant feels wrong. Argues that the emotional revulsion at physically pushing someone matters and shouldn\'t be dismissed as irrational. The discomfort is data about what kind of society we want to live in.',
      avatarEmoji: '🩺',
      voice: 'nova',
    },
  ],
  outcome:
    'There is no single "correct" answer to the trolley problem — that\'s precisely why it has dominated moral philosophy for over fifty years. Surveys consistently show that roughly 85-90% of people say they would pull the lever (divert the trolley), but only about 10-20% say they would push the man off the footbridge — even though the utilitarian calculus is identical in both cases. This asymmetry has been studied extensively by psychologists and neuroscientists. Joshua Greene\'s fMRI research showed that the footbridge variant activates brain regions associated with emotional processing (the ventromedial prefrontal cortex), while the lever variant engages areas associated with cognitive reasoning (the dorsolateral prefrontal cortex). This suggests we have two competing moral systems — one fast and emotional, one slow and rational — and the trolley problem forces them into direct conflict. Philosophers remain divided. Peter Singer and other utilitarians argue we should override our emotional responses and follow the math. Kantians and virtue ethicists argue that the emotional response tracks something morally real — that there is a genuine moral difference between redirecting a threat and using a person as a tool. The debate has become urgently practical with the rise of autonomous vehicles: how should a self-driving car be programmed when a crash is unavoidable? The "Moral Machine" project at MIT collected 40 million responses from people in 233 countries, revealing significant cultural variation in how people answer these questions.',
};

export const oppenheimerPreset: Scenario = {
  slug: 'oppenheimer-hearing',
  backgroundImage: '/images/oppenheimer.png',
  introNarrative:
    'Room 2022 of the Atomic Energy Commission building is small, windowless, and deliberately uncomfortable. The fluorescent lights hum. Three men sit behind a table with the power to end the career of the most famous scientist in America. Across from them sits J. Robert Oppenheimer, thin, chain-smoking, the man who built the bomb that ended the war. The charges are read: associations with Communists, opposition to the hydrogen bomb. But everyone knows the real question \u2014 when a man helps create the most destructive weapon in history, then tells his government not to build a bigger one, is he a patriot or a threat?',
  mode: 'education',
  category: 'science-ethics',
  difficulty: 'intermediate',
  participantRange: { min: 5, max: 25 },
  title: 'The Oppenheimer Hearing',
  description:
    'It is April 1954. J. Robert Oppenheimer, the physicist who led the creation of the atomic bomb, is facing a security hearing that will determine whether he can continue to advise the United States government. The real question goes deeper: when a scientist helps create a weapon of unprecedented destructive power, what responsibility do they bear — and what happens when they try to put the genie back in the bottle?',
  context:
    'J. Robert Oppenheimer directed the Los Alamos Laboratory from 1943 to 1945, leading the Manhattan Project that produced the first nuclear weapons. After the bombings of Hiroshima and Nagasaki killed an estimated 110,000-210,000 people, Oppenheimer famously quoted the Bhagavad Gita: "Now I am become Death, the destroyer of worlds." He became the most influential science advisor in America, chairing the Atomic Energy Commission\'s General Advisory Committee. But he opposed the development of the hydrogen bomb (the "Super"), arguing it was a weapon of genocide with no legitimate military use. This put him in direct conflict with Edward Teller, the physicist who championed the H-bomb, and with powerful political figures like Lewis Strauss, chairman of the AEC, who saw Oppenheimer as a security risk and an obstacle to American nuclear supremacy. In December 1953, Oppenheimer\'s security clearance was suspended, and a hearing was convened in April 1954 before a Personnel Security Board. The hearing was nominally about whether Oppenheimer was a security risk, but it became a broader trial about the relationship between science, conscience, and state power during the Cold War. Oppenheimer\'s past associations with Communist Party members (including his brother Frank and his former girlfriend Jean Tatlock) were used against him, despite having been known to the government for years.',
  setting: 'April 1954, Washington D.C., AEC Personnel Security Board Hearing',
  centralQuestion: 'Should J. Robert Oppenheimer retain his security clearance and continue to advise the U.S. government on nuclear policy?',
  votingOptions: [
    { id: 'retain', label: 'Retain clearance — his expertise and conscience are vital', votes: 0 },
    { id: 'revoke', label: 'Revoke clearance — he cannot be trusted with nuclear secrets', votes: 0 },
    { id: 'compromise', label: 'Suspend temporarily — review after the current political climate cools', votes: 0 },
  ],
  stages: [
    {
      id: 'opening',
      type: 'freeform',
      title: 'The Charges',
      description:
        'Introduce your character and state your initial position. Is this a legitimate security review or a political vendetta? Declare where you stand on the man who built the bomb.',
      durationSeconds: 300,
    },
    {
      id: 'debate',
      type: 'debate',
      title: 'The Case For and Against',
      description:
        'Structured arguments. The prosecution emphasizes Oppenheimer\'s Communist associations and his opposition to the hydrogen bomb. The defense argues that dissent is not disloyalty, and that silencing scientific conscience is dangerous for democracy. Should scientists who create weapons have a special obligation to speak about their use?',
      durationSeconds: 600,
    },
    {
      id: 'npc-react',
      type: 'npc_response',
      title: 'Testimony',
      description:
        'Key witnesses respond to the arguments: Edward Teller and Isidor Rabi offer their testimony about Oppenheimer\'s character, loyalty, and judgment.',
      durationSeconds: 180,
    },
    {
      id: 'final-speeches',
      type: 'speech',
      title: 'Closing Arguments',
      description:
        'Final statements before the board votes. What precedent does this decision set for the relationship between scientists and the state?',
      durationSeconds: 300,
    },
    {
      id: 'vote',
      type: 'vote',
      title: 'The Board Decides',
      description: 'The board votes on Oppenheimer\'s security clearance.',
      durationSeconds: 120,
    },
    {
      id: 'verdict',
      type: 'verdict',
      title: 'The Verdict',
      description:
        'The board delivers its decision and the historical outcome is revealed.',
      durationSeconds: 300,
    },
  ],
  roles: [
    {
      id: 'oppenheimer',
      name: 'J. Robert Oppenheimer',
      title: 'Former Director, Los Alamos Laboratory',
      description:
        'The subject of the hearing. Oppenheimer must defend his loyalty to the United States while maintaining his conviction that the hydrogen bomb represents a moral line that should not be crossed. He can be arrogant, elliptical, and self-destructive under questioning — historically, his own testimony damaged his case because he was too honest about his conflicted feelings. Key challenge: how do you defend dissent without appearing disloyal in the McCarthy era?',
      suggestedFor: 'ta',
      assignedTo: '',
    },
    {
      id: 'prosecutor',
      name: 'Roger Robb',
      title: 'AEC Prosecuting Attorney',
      description:
        'The government\'s attorney, aggressive and well-prepared. Robb has access to transcripts of Oppenheimer\'s wiretapped phone calls (which the defense has not seen — a major procedural unfairness). His strategy is to trap Oppenheimer in contradictions about his past Communist associations and to portray his H-bomb opposition as motivated by disloyalty rather than conscience. Argues that in the Cold War, the government cannot afford to trust anyone with doubts about American nuclear supremacy.',
      suggestedFor: 'student',
      assignedTo: '',
    },
    {
      id: 'defense',
      name: 'Lloyd Garrison',
      title: 'Defense Attorney',
      description:
        'Oppenheimer\'s lawyer, principled but working at a severe disadvantage — the hearing is not a trial, so normal rules of evidence don\'t apply, and classified material can be used against the defendant without being shared with the defense. Argues that Oppenheimer\'s entire career demonstrates loyalty: he built the bomb when his country asked, he served on every committee, and his opposition to the H-bomb was a legitimate policy disagreement, not treason. The real question: is America safer with Oppenheimer advising or silenced?',
      suggestedFor: 'student',
      assignedTo: '',
    },
  ],
  npcs: [
    {
      id: 'teller',
      name: 'Edward Teller',
      title: 'Physicist, Father of the Hydrogen Bomb',
      personality:
        'Teller feels that Oppenheimer used his influence to delay the H-bomb, costing America years in the arms race with the Soviet Union. He speaks with a heavy Hungarian accent and the conviction of someone who fled fascism and believes American nuclear supremacy is the only thing preventing another Holocaust. He is not lying — he believes Oppenheimer is dangerous. But his testimony will destroy a former colleague and divide the physics community for a generation.',
      context:
        'Edward Teller was a Hungarian-American physicist who championed the development of the hydrogen bomb. He and Oppenheimer clashed repeatedly: Oppenheimer thought the H-bomb was technically uncertain and morally unconscionable; Teller thought it was essential for national survival. At the hearing, Teller delivered the most damaging testimony: "I would like to see the vital interests of this country in hands which I understand better, and therefore trust more." This careful, devastating statement stopped short of calling Oppenheimer disloyal but achieved the same effect. Teller was shunned by much of the physics community afterward — many colleagues refused to shake his hand for decades.',
      stance:
        'Does not call Oppenheimer a traitor. Instead, expresses doubt about his "judgment" and "wisdom" — a distinction that is technically defensible but practically devastating. Argues that Oppenheimer\'s opposition to the H-bomb was not just wrong but dangerously wrong, and that his influence over other scientists made him an obstacle to national security. Believes he is doing the right thing, even though it costs him friendships.',
      avatarEmoji: '☢️',
      voice: 'echo',
    },
    {
      id: 'rabi',
      name: 'Isidor Isaac Rabi',
      title: 'Nobel Laureate in Physics',
      personality:
        'Rabi is one of the most respected physicists in America and he is furious that the government is putting Oppenheimer on trial for having a conscience. Speaks with blunt New York directness and doesn\'t bother hiding his contempt for the proceedings. His testimony is the strongest defense of Oppenheimer — not because he agrees with all of Oppenheimer\'s decisions, but because he sees the hearing as an attack on the principle that scientists must be free to advise honestly.',
      context:
        'Isidor Rabi won the Nobel Prize in Physics in 1944 for his work on nuclear magnetic resonance. He was a close colleague of Oppenheimer\'s and served on the same advisory committees. At the hearing, Rabi delivered perhaps the most memorable testimony: "In a great number of cases I have seen Dr. Oppenheimer act — Loss is a feeble word for it — in a very, positive way, for the safety of the country... We have an A-bomb and a whole series of it, and what more do you want, mermaids?" His point was that Oppenheimer had already given America its most powerful weapon and deserved gratitude, not persecution.',
      stance:
        'Passionately defends Oppenheimer. Argues the hearing is a travesty — Oppenheimer built the atomic bomb for America, his Communist associations were known for years and didn\'t prevent his clearance before, and his H-bomb opposition was legitimate scientific advice, not sabotage. The real danger isn\'t Oppenheimer; it\'s a government that punishes scientists for honest counsel.',
      avatarEmoji: '⚛️',
      voice: 'onyx',
    },
  ],
  outcome:
    'The Personnel Security Board voted 2-1 to revoke Oppenheimer\'s security clearance on June 29, 1954. The majority opinion, written by Gordon Gray and Thomas Morgan, found that Oppenheimer was a "loyal citizen" but that his "continuing conduct and associations" and his "obstruction" of the hydrogen bomb program made him a security risk. The lone dissenter, Ward Evans, wrote that revoking the clearance of the man who built the atomic bomb would be "a black mark on the escutcheon of our country." The decision effectively ended Oppenheimer\'s influence on nuclear policy. He retreated to Princeton, where he directed the Institute for Advanced Study until his death from throat cancer in 1967. Edward Teller was shunned by much of the physics community — at a conference shortly after the hearing, most of his colleagues refused to shake his hand. The Oppenheimer hearing became a landmark case in the history of science and state power, often compared to the Galileo affair. It raised questions that remain urgent: When scientists help create dangerous technologies, do they have a special right — or duty — to speak about their use? Can a democracy afford to silence its most knowledgeable experts when their advice is politically inconvenient? In 2022, the U.S. Department of Energy formally vacated the 1954 revocation, with Secretary Jennifer Granholm stating that the process had been "flawed" and that Oppenheimer had been denied "a fair process that respected the rights to which every American citizen is entitled."',
};

export const facialRecognitionPreset: Scenario = {
  slug: 'surveillance-technology-ordinance',
  backgroundImage: '/images/facial-recognition.png',
  introNarrative:
    'It is a Tuesday evening in early 2020, and the Santa Cruz City Council chambers are about half full \u2014 a decent turnout for a weeknight. Most of the faces are familiar: neighborhood association regulars, a few downtown business owners, some UCSC students in the back row, a couple of retirees who come to every meeting. The agenda item sounds technical \u2014 a "Surveillance Technology Ordinance" \u2014 but the room has an unusual energy. The ordinance would ban facial recognition and predictive policing technology citywide. What makes it strange is that almost nobody in the room disagrees with the basic idea. The police chief supports it. The ACLU supports it. The NAACP chapter supports it. And yet there is real tension, because the people in this room want very different things from their city, and this vote is making those differences visible.',
  mode: 'civic',
  category: 'criminal-justice',
  difficulty: 'introductory',
  participantRange: { min: 4, max: 30 },
  title: 'The Surveillance Technology Ordinance',
  description:
    'It is early 2020 in Santa Cruz, California. The city council is considering an ordinance that would ban facial recognition technology and predictive policing software citywide \u2014 the first ban of its kind passed by a city council in the United States. The unusual thing: the police chief supports the ban. The real debate is not about whether to ban it, but what the ordinance reveals about different visions of the city.',
  context:
    'Santa Cruz in 2020 is a small coastal city of about 65,000 people, home to UC Santa Cruz and shaped by decades of progressive politics. It is also a city under real strain. Housing costs have pushed working-class residents toward the margins. Homelessness is visible and contentious \u2014 encampments along the San Lorenzo River and in city parks are a constant source of friction between housed and unhoused residents. Downtown Pacific Avenue businesses deal with persistent property crime, shoplifting, and public disorder. The police department is understaffed and underfunded. Into this context comes the surveillance technology ordinance, introduced by Vice-Mayor Justin Cummings. The ordinance would ban any city department from acquiring or using facial recognition technology, and would also ban predictive policing software \u2014 a pointed move, since PredPol, one of the leading predictive policing companies, was literally founded in Santa Cruz in 2012 with the cooperation of the SCPD. The department quietly dropped the software in 2017 when Andy Mills became police chief, favoring community-oriented policing. Chief Mills supports the ban. San Francisco and Somerville, Massachusetts have already passed similar measures. The ACLU, the Electronic Frontier Foundation, and the Santa Cruz NAACP chapter all back the ordinance. A federal NIST study found facial recognition algorithms misidentified Black and Asian people up to 100 times more often than white people. Clearview AI, a startup, had been scraping billions of social media photos and offering its tool to police departments nationwide \u2014 often without city governments\' knowledge. But the politics are not simple. Santa Cruz is a sanctuary city with a significant undocumented population. It has neighborhoods where residents feel both over-policed and underprotected. And it is a city where the gap between progressive ideals and daily reality \u2014 property crime, homelessness, strained city services \u2014 generates real frustration that does not map neatly onto partisan lines.',
  setting: 'Early 2020, Santa Cruz, California \u2014 City Council Chambers',
  centralQuestion: 'Should Santa Cruz pass the surveillance technology ordinance banning facial recognition and predictive policing?',
  votingOptions: [
    { id: 'full-ban', label: 'Pass the full ordinance as written', votes: 0 },
    { id: 'limited-use', label: 'Ban predictive policing but allow limited facial recognition with oversight', votes: 0 },
    { id: 'moratorium', label: 'Temporary moratorium \u2014 revisit in two years as the technology evolves', votes: 0 },
    { id: 'no-ban', label: 'No ban \u2014 focus city resources on other priorities', votes: 0 },
  ],
  stages: [
    {
      id: 'opening',
      type: 'freeform',
      title: 'Public Comment Opens',
      description:
        'Introduce your character and explain what brought you to the council chambers tonight. What is your stake in this decision? Speak from your own experience in the city.',
      durationSeconds: 300,
    },
    {
      id: 'debate',
      type: 'debate',
      title: 'The Hearing',
      description:
        'The council hears arguments. Since most people broadly support the ban, the real tensions emerge: is this ordinance the right priority for a city dealing with a housing crisis and understaffed police? Does it go far enough? Does it address the concerns of the communities most affected by surveillance? What does Santa Cruz owe its most vulnerable residents?',
      durationSeconds: 600,
    },
    {
      id: 'npc-react',
      type: 'npc_response',
      title: 'Community Voices',
      description:
        'Residents and officials who have been listening respond to the arguments, bringing the lived reality of different Santa Cruz neighborhoods into the conversation.',
      durationSeconds: 180,
    },
    {
      id: 'final-speeches',
      type: 'speech',
      title: 'Final Statements',
      description:
        'Last chance to address the council before the vote. The question is no longer just about facial recognition \u2014 it is about what kind of city Santa Cruz wants to be.',
      durationSeconds: 300,
    },
    {
      id: 'vote',
      type: 'vote',
      title: 'The Council Votes',
      description: 'The council votes on the surveillance technology ordinance.',
      durationSeconds: 120,
    },
    {
      id: 'debrief',
      type: 'debrief',
      title: 'Debrief & Reflect',
      description:
        'The result is discussed, the real-world outcome is revealed, and participants reflect on what they learned.',
      durationSeconds: 300,
    },
  ],
  roles: [
    {
      id: 'council-chair',
      name: 'Council Chair',
      title: 'Santa Cruz City Council Chair',
      description:
        'Moderates the hearing and manages public comment. You support the ordinance in principle \u2014 most of the council does \u2014 but you want the process to be genuine, not a rubber stamp. You know there are residents in this room who feel unheard by city government on other issues, and you want them to feel like tonight matters. You also know the vote will likely be unanimous, which makes you wonder whether the hearing is really serving its purpose or just performing consensus. Push speakers to be specific. Ask follow-up questions. Do not let anyone \u2014 on any side \u2014 get away with platitudes.',
      suggestedFor: 'facilitator',
      assignedTo: '',
    },
    {
      id: 'aclu-advocate',
      name: 'ACLU Organizer',
      title: 'ACLU of Northern California, Santa Cruz Chapter',
      description:
        'You have been working on this ordinance for months with the vice-mayor\'s office and Oakland Privacy. You know the legal landscape cold: San Francisco\'s ban, the NIST bias studies, the Clearview AI scandal. You are here to make sure the ordinance passes in its strongest possible form. But you are also a Santa Cruz resident, and you are aware that some people in this room see the ACLU as outsiders who care more about national headlines than the neighborhood. Your challenge: connect the abstract civil liberties argument to the specific reality of this city. Why does this matter to the person whose car got broken into on the west side? Why does it matter to the family in Beach Flats?',
      suggestedFor: 'student',
      assignedTo: '',
    },
    {
      id: 'business-owner',
      name: 'Pacific Avenue Business Owner',
      title: 'Downtown Santa Cruz shop owner',
      description:
        'You run a store on Pacific Avenue. You have dealt with shoplifting, vandalism, and break-ins for years. You are not opposed to the ban \u2014 you do not particularly want the government scanning faces \u2014 but you are frustrated that the council seems more interested in making a national statement about surveillance technology than in addressing the daily reality of doing business downtown. You want to know: what is the city actually going to do about property crime? If you take tools off the table, what goes on the table instead? You are tired of being told that your concerns about safety are really about criminalizing poverty.',
      suggestedFor: 'student',
      assignedTo: '',
    },
  ],
  npcs: [
    {
      id: 'westside-resident',
      name: 'Westside Resident',
      title: 'Longtime Santa Cruz homeowner',
      personality:
        'Plainspoken, a little impatient, not interested in scoring political points. Has lived in the same house near Natural Bridges for over twenty years. Speaks from accumulated frustration with a city government that feels increasingly disconnected from the people who actually live here year-round. Not hostile, but tired. Voted for every progressive ballot measure and is starting to wonder what any of it has actually changed on their street.',
      context:
        'Represents the longtime Santa Cruz residents who broadly share the city\'s progressive values but feel the gap between those values and their daily experience widening. Their car has been broken into twice in the past year. They have called the police about encampment activity near their property and been told the department does not have the staffing to respond. They see the council spending political energy on a surveillance technology ban \u2014 for technology the city does not even use \u2014 and they want to know why this is the priority.',
      stance:
        'Not opposed to the ban. Genuinely does not care much about facial recognition one way or another. But wants the council to hear that passing a symbolic ordinance is not a substitute for the things the city is failing to do: fund the police department, address homelessness, fix the roads. Will support the ban if someone can explain how it connects to making the city work better, not just making it look good in the news. Asks pointed questions like: "How much staff time went into drafting this? What else could that time have been spent on?"',
      avatarEmoji: '\uD83C\uDFE0',
      voice: 'echo',
    },
    {
      id: 'beach-flats-resident',
      name: 'Beach Flats Resident',
      title: 'Service worker, Beach Flats neighborhood',
      personality:
        'Guarded at first \u2014 not used to speaking at city council meetings and a little self-conscious about it. But once they start talking, they are concrete and specific. Does not speak in policy language. Describes things they have seen and experienced: being stopped and asked for ID, a neighbor afraid to call the police because of immigration status, kids who walk past the boardwalk cameras every day on their way to school.',
      context:
        'Beach Flats is a small, primarily Latino neighborhood adjacent to the Santa Cruz Beach Boardwalk. It is one of the most diverse and lowest-income neighborhoods in the city. Residents experience both higher rates of property crime and more frequent police contact than wealthier parts of Santa Cruz. The neighborhood sits in a complicated position: residents want police help with real safety problems but also fear that surveillance tools will be used to target undocumented community members. Santa Cruz is a sanctuary city, but that designation feels abstract when you are wondering whether a camera on the boardwalk is feeding data to a federal database.',
      stance:
        'Supports the ban, but from a specific and personal place rather than an ideological one. The concern is not abstract civil liberties \u2014 it is that a neighbor might get deported, that their teenager might get flagged by an algorithm trained on arrest data from a system that already over-polices their neighborhood. But also wants to be heard on the other side: they want the police to actually show up when someone breaks into the laundromat. They are navigating a real contradiction and they know it. They do not have a clean policy position. They have a life.',
      avatarEmoji: '\uD83C\uDFD6\uFE0F',
      voice: 'nova',
    },
    {
      id: 'city-councillor',
      name: 'City Council Member',
      title: 'Santa Cruz City Council',
      personality:
        'Pragmatic, detail-oriented, supportive of the ban in principle but preoccupied with implementation and cost. Tends to ask the boring-but-important questions that nobody else wants to deal with: what does this actually require city staff to do? How do we enforce it? What happens when the county sheriff, who is not covered by a city ordinance, uses facial recognition anyway? Not charismatic, but the person in the room who has actually read the ordinance line by line.',
      context:
        'Santa Cruz city government in 2020 is stretched thin. The city budget is under pressure from rising pension costs, deferred infrastructure maintenance, and the escalating cost of homelessness services. Every hour of staff time spent drafting and implementing a new ordinance is an hour not spent on something else. The council member is also aware that the ordinance only covers city departments \u2014 it does not bind the county sheriff, state agencies, or federal law enforcement, all of which operate in Santa Cruz. There is a practical question about whether a city-level ban actually prevents the surveillance it aims to prevent, or whether it just moves it to a different jurisdiction.',
      stance:
        'Will vote yes. But wants the discussion to be honest about what the ordinance does and does not do. Pushes back on rhetoric that frames this as a decisive victory for civil liberties \u2014 the county sheriff can still use whatever technology they want. Wants to know: should the ordinance include a requirement that the city advocate for county-level and state-level action? Is there funding attached for community oversight? What is the enforcement mechanism if a department violates the ban? Sees the ordinance as a reasonable first step, not a solution.',
      avatarEmoji: '\uD83D\uDCCB',
      voice: 'onyx',
    },
  ],
  outcome:
    'The Santa Cruz City Council voted unanimously to pass the surveillance technology ordinance on June 23, 2020 \u2014 the first city in the United States to ban both facial recognition and predictive policing through a city council vote. The ban was championed by Vice-Mayor Justin Cummings with support from Police Chief Andy Mills, who stated that predictive policing "has been shown over time to put officers in conflict with communities rather than working with the communities." The irony was not lost on observers: PredPol, the predictive policing company whose software the ordinance banned, had been founded in Santa Cruz in 2012 with the SCPD\'s cooperation. The company\'s CEO did not speak at the hearing. The vote was part of a broader national movement \u2014 San Francisco, Somerville, Boston, Minneapolis, and Portland passed similar measures. But the aftermath was more complicated than the vote suggested. New Orleans, which passed its own ban in 2020, quietly reversed course in 2022 after a homicide spike, allowing facial recognition for violent crime investigations. Virginia passed a law permitting police use with a court order. The broader questions the Santa Cruz hearing surfaced \u2014 about city priorities, about the gap between symbolic action and material change, about who gets to feel safe \u2014 were not resolved by the vote. They persist in Santa Cruz and in every city grappling with how to govern technology that is evolving faster than the democratic process can follow.',
};

export const socratesPreset: Scenario = {
  slug: 'trial-of-socrates',
  backgroundImage: '/images/socrates.png',
  introBannerImage: '/images/socrates-intro.png',
  introNarrative:
    'Five hundred citizens sit on wooden benches in the open air, chosen by lot to judge the most famous philosopher in Athens. Socrates is seventy years old. He has no lawyer. He has refused to flee, refused to beg, refused to stop asking questions. For decades he has stood in the agora \u2014 the marketplace, the heart of the city \u2014 and asked passing statesmen, poets, and craftsmen to explain what they know. Invariably they cannot. The powerful men of Athens have grown tired of being made to look foolish. But the charges are not about embarrassment. They are about the soul of the democracy itself: does a free society owe loyalty to its gods and traditions, or does it owe its citizens the right to question everything?',
  mode: 'education',
  category: 'philosophy',
  difficulty: 'introductory',
  participantRange: { min: 4, max: 30 },
  title: 'The Trial of Socrates',
  description:
    'It is 399 BCE in Athens. Five hundred citizens chosen by lot must judge Socrates, the city\'s most famous philosopher, on charges of impiety and corrupting the youth. But the real question runs deeper: can a democracy tolerate a man who teaches people to question its foundational beliefs?',
  context:
    'Athens in 399 BCE is a wounded democracy. Just five years earlier, the Thirty Tyrants \u2014 an oligarchic junta backed by Sparta \u2014 overthrew the democratic government, executed fifteen hundred citizens, and ruled through terror for eight months. Democracy has been restored, but the scars are deep. Several of the Thirty\'s most notorious members \u2014 including Critias and Charmides \u2014 were former students of Socrates. Although Socrates himself defied the Tyrants (refusing to arrest an innocent man when ordered), many Athenians see his philosophical method as the seed of the oligarchic coup. His relentless questioning of democratic assumptions, they argue, taught the young elites to despise democracy. The formal charges are impiety (not believing in the city\'s gods, introducing new divinities) and corruption of the youth. But the trial is really about whether democratic Athens can tolerate a man who teaches people to question its foundational beliefs.',
  setting: 'Athens, 399 BCE \u2014 The People\'s Court (Heliaia)',
  centralQuestion: 'Should Athens condemn Socrates to death for corrupting the youth and impiety toward the gods?',
  votingOptions: [
    { id: 'acquit', label: 'Acquit \u2014 Socrates is guilty of nothing more than free inquiry', votes: 0 },
    { id: 'exile', label: 'Convict but exile \u2014 banish him from Athens rather than execute', votes: 0 },
    { id: 'condemn', label: 'Convict and condemn \u2014 the law must be upheld and Athens protected', votes: 0 },
  ],
  stages: [
    {
      id: 'opening',
      type: 'freeform',
      title: 'Opening Statements',
      description:
        'Introduce your character and state your initial position. Accusers: explain why Socrates threatens Athens. Defenders: explain why his philosophy strengthens it. Jurors: describe your experience of the post-tyranny city.',
      durationSeconds: 300,
    },
    {
      id: 'debate',
      type: 'debate',
      title: 'The Prosecution and Defense',
      description:
        'Present your arguments. Was Socrates\' questioning a form of civic virtue or civic sabotage? Did his former students\' crimes implicate his teachings?',
      durationSeconds: 600,
      events: [
        {
          id: 'witness-testimony',
          text: 'A Witness Steps Forward',
          description:
            'A former student of Socrates describes how his teaching changed their understanding of justice and morality \u2014 but is it for better or worse?',
          minDelay: 60,
          maxDelay: 180,
          probability: 0.85,
        },
        {
          id: 'tyrants-invoked',
          text: 'The Shadow of the Thirty',
          description:
            'Someone raises the names of Critias and Charmides \u2014 members of the Thirty Tyrants who studied with Socrates. The courtroom stirs.',
          minDelay: 120,
          maxDelay: 300,
          probability: 0.9,
        },
      ],
    },
    {
      id: 'npc-react',
      type: 'npc_response',
      title: 'Testimony',
      description:
        'The court hears from key witnesses and interested parties.',
      durationSeconds: 180,
    },
    {
      id: 'final-speeches',
      type: 'speech',
      title: 'Final Speeches',
      description:
        'Make your final appeals to the jury. Socrates historically refused to beg for mercy \u2014 will the defense follow his example?',
      durationSeconds: 300,
      events: [
        {
          id: 'socrates-daimonion',
          text: 'Socrates Speaks of His Inner Voice',
          description:
            'Socrates mentions his daimonion \u2014 the divine inner voice that warns him when he is about to do wrong. It has not warned him against this trial. The crowd murmurs \u2014 is this the \'new divinity\' he\'s accused of introducing?',
          minDelay: 30,
          maxDelay: 120,
          probability: 0.8,
        },
      ],
    },
    {
      id: 'vote',
      type: 'vote',
      title: 'The Jury Votes',
      description: 'Cast your ballot. In Athenian law, there is no deliberation \u2014 each juror votes their conscience.',
      durationSeconds: 120,
    },
    {
      id: 'verdict',
      type: 'verdict',
      title: 'The Verdict',
      description:
        'The verdict is read and the historical outcome revealed.',
      durationSeconds: 300,
    },
  ],
  roles: [
    {
      id: 'socrates',
      name: 'Socrates',
      title: 'The Accused',
      description:
        'The accused. Seventy years old, a stonemason\'s son who became Athens\' most famous philosopher. You believe the unexamined life is not worth living. You will not beg, flatter, or weep before the jury. You may defend yourself \u2014 but on your own terms.',
      suggestedFor: 'ta',
      assignedTo: '',
    },
    {
      id: 'meletus',
      name: 'Meletus',
      title: 'Lead Prosecutor',
      description:
        'The lead prosecutor, a young poet. You brought the formal charges of impiety and corruption of the youth. Some say you are a puppet of more powerful men. Prove them wrong \u2014 make the case that Socrates is genuinely dangerous to Athens\' religious and civic foundations.',
      suggestedFor: 'student',
      assignedTo: '',
    },
    {
      id: 'anytus',
      name: 'Anytus',
      title: 'Democratic Politician and Co-Prosecutor',
      description:
        'A wealthy tanner and democratic politician. You fought against the Thirty Tyrants and helped restore the democracy. You see Socrates as the intellectual father of the oligarchic coup. Your son studied with Socrates and abandoned the family trade to pursue philosophy \u2014 you take this personally.',
      suggestedFor: 'student',
      assignedTo: '',
    },
  ],
  npcs: [
    {
      id: 'chaerecrates',
      name: 'Chaerecrates',
      title: 'Brother of Chaerephon, Friend of Socrates',
      personality:
        'Earnest and a little overwhelmed by the gravity of the moment. Speaks plainly, without rhetorical flourish. Loyal to his dead brother\'s memory.',
      context:
        'Chaerephon \u2014 now dead \u2014 once asked the Oracle at Delphi if anyone was wiser than Socrates. The Oracle said no. Socrates claimed this is what started his philosophical mission: trying to find someone wiser than himself, and failing.',
      stance:
        'Defends Socrates. Argues that Socrates\' mission was divinely ordained \u2014 the opposite of impiety.',
      avatarEmoji: '\uD83C\uDFDB\uFE0F',
      voice: 'echo',
    },
    {
      id: 'thais',
      name: 'Thais',
      title: 'Mother of a Student of Socrates',
      personality:
        'Passionate, protective, torn. Her son came home asking questions that frightened her \u2014 questioning the gods, questioning duty to parents, questioning everything. But she also saw him become more thoughtful, more just.',
      context:
        'Represents the ordinary Athenians caught between admiration and fear of Socrates\' influence on the young.',
      stance:
        'Conflicted. Sees both the danger and the value. Asks the court whether wisdom that disturbs is worse than comfortable ignorance.',
      avatarEmoji: '\uD83D\uDC69',
      voice: 'nova',
    },
    {
      id: 'thrasymachus',
      name: 'Thrasymachus',
      title: 'Sophist and Rhetorician',
      personality:
        'Aggressive, theatrical, brilliant. Despises Socrates for undermining the art of rhetoric and for his false humility. Believes justice is simply the advantage of the stronger.',
      context:
        'A professional teacher of rhetoric who charges fees \u2014 everything Socrates is not. Socrates has publicly humiliated sophists like him in philosophical arguments.',
      stance:
        'Against Socrates \u2014 but for cynical reasons. Argues that Socrates is the most dangerous kind of corruptor: one who genuinely believes he\'s helping.',
      avatarEmoji: '\uD83C\uDFAD',
      voice: 'onyx',
    },
  ],
  outcome:
    'Socrates was convicted by a vote of 280 to 221 \u2014 a narrow margin, meaning just 30 votes would have acquitted him. Athenian law allowed the convicted to propose an alternative penalty to the prosecution\'s demand for death. Socrates initially suggested the city should reward him with free meals at the Prytaneum (the honor given to Olympic victors), arguing that what he did for Athens was far more valuable than any athletic victory. This provocative counter-proposal infuriated the jury. He eventually proposed a small fine. The jury voted for death by a larger margin than the conviction itself \u2014 some who voted to acquit switched to vote for death, angered by his apparent arrogance. Socrates spent thirty days in prison while Athens celebrated a religious festival. His friends offered to bribe the guards and arrange his escape to Thessaly, but he refused, arguing in what Plato recorded as the "Crito" that breaking the law \u2014 even an unjust verdict \u2014 would undermine the social contract that made civilized life possible. He drank the hemlock surrounded by his students. Plato, who was present, recorded that Socrates\' last words were: "Crito, we owe a rooster to Asclepius. Pay it and do not neglect it." The meaning of this final statement has been debated for twenty-four centuries.',
};

export const presetScenarios = [
  teotihuacanPreset,
  axumPreset,
  pompeiiPreset,
  plagueCambridgePreset,
  trolleyPreset,
  oppenheimerPreset,
  facialRecognitionPreset,
  socratesPreset,
] as const;

export function getPresetBySlug(slug: string): Scenario | null {
  return presetScenarios.find((preset) => preset.slug === slug) ?? null;
}
