import { Scenario } from './types';

export const teotihuacanPreset: Scenario = {
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
      title: 'The Ashes Are Still Warm',
      description:
        'Introduce your character and describe what you witnessed during the fires. Share your account of who was responsible and what it means for the city.',
      durationSeconds: 300,
    },
    {
      id: 'debate',
      type: 'debate',
      title: 'The Council of the Four Quarters',
      description:
        'Representatives of the city\'s factions debate the path forward. Should Teotihuacan rebuild its temples and reassert divine authority, restructure its government, or accept that the city\'s age of dominance is ending?',
      durationSeconds: 600,
    },
    {
      id: 'npc-react',
      type: 'npc_response',
      title: 'Voices from Beyond the Valley',
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
      title: 'The Fate of the City',
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
        'The senior surviving priest of the Temple of the Feathered Serpent (Ciudadela). Ixtan must navigate between defending the old religious order that gave him power and acknowledging the legitimate grievances that may have sparked the fires. He can argue that without divine sanction and ritual order, the city will collapse entirely — the gods must be appeased. But he must also explain why the gods allowed the destruction in the first place. Deeply learned in astronomical observation and calendar keeping, he controls knowledge that is essential to agriculture and trade.',
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
        'Shrewd, observant, and quietly calculating. K\'inich Bahlam presents himself as a concerned ally but is carefully assessing whether Teotihuacan\'s decline creates opportunities for Tikal and other Maya kingdoms. He speaks with elaborate courtesy that barely conceals his political maneuvering. He remembers the "Entrada" of 378 CE, when Teotihuacan-affiliated warriors overthrew Tikal\'s dynasty — an intervention that still shapes Maya politics. He is torn between old resentment and genuine respect for the city.',
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
        'Ancient, oracular, and unsettling. Citlalmina speaks in riddles and metaphors drawn from the natural world — spiders, caves, water, jade. She represents the oldest religious traditions of Teotihuacan, centered on the mysterious "Great Goddess" depicted in the murals of Tepantitla. She is not aligned with the male priestly hierarchy of the Feathered Serpent temple and may see the fire as a necessary purification. She commands deep reverence from the common people and the apartment compound communities.',
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
  backgroundImage: '/images/axum.png',
  introBannerImage: '/images/axum-intro.png',
  introNarrative:
    'The incense smoke curls upward from the altar of Mahrem, god of war and patron of kings. But today, King Ezana does not kneel before the old stone idol. He stands at the window of the royal palace, looking out over a city caught between worlds \u2014 the obelisks of his ancestors tower over new churches where hymns are sung in Greek.',
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
        'Smooth, diplomatic, and calculating. Theophilus presents himself as a friend of Axum but always advances Roman imperial interests. He is an Arian Christian — he believes the Son is subordinate to the Father, putting him at odds with the Nicene Christianity of Frumentius and Athanasius. He subtly undermines Frumentius while still pushing for Christian conversion, revealing that even among Christians there is deep disagreement.',
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
        'Shrewd, protective, and deeply concerned with the stability of the kingdom. Sofya has navigated court politics for decades and survived the regency period after her husband\'s death. Pragmatic and politically astute, she speaks with the authority of someone who has held real power. Not easily swayed by theological arguments — she wants to know the practical consequences. Protective of Ezana but willing to challenge him.',
      context:
        'While the specific identity of Ezana\'s mother is not well documented, queen mothers held significant political influence in Axumite court politics, particularly during regencies. The role represents the domestic political dimension of the conversion decision — the internal power dynamics that a foreign religion would disrupt.',
      stance:
        'Cautious and pragmatic. Not opposed to Christianity in principle, but deeply worried about the pace and consequences of conversion. What happens to the noble families tied to the old temples? Will the common people accept this? Could a compromise — tolerating Christianity without making it official — preserve stability?',
      avatarEmoji: '👸',
      avatarImage: '/images/queenmother.png',
      voice: 'nova',
    },
  ],
  outcome:
    'King Ezana did convert to Christianity around 330-340 CE, making Axum one of the first states in the world to adopt Christianity as its official religion. His coins changed from displaying the disc and crescent of the traditional gods to the cross. When Emperor Constantius II sent a letter demanding that Frumentius be sent to Alexandria for "re-examination" by an Arian bishop, Ezana refused — asserting Axum\'s religious independence from Rome. The Ethiopian Orthodox Church, tied to the Alexandrian (Coptic) tradition, became one of the oldest Christian institutions in the world, profoundly shaping Ethiopian culture, art, and politics for over 1,600 years. However, traditional practices were not immediately eliminated — they blended with Christianity in complex ways that scholars still study today. The old gods faded slowly, and elements of pre-Christian belief persisted in folk practice for centuries.',
};

export const pompeiiPreset: Scenario = {
  backgroundImage: '/images/pompeii.png',
  introNarrative:
    'It begins as a curiosity. A column of smoke rises from Vesuvius, shaped like an umbrella pine. But within the hour, the sky darkens to the color of bruised iron, and the first hot stones begin to fall. Then the message arrives: a woman trapped at the foot of the volcano. Only the fleet can save her.',
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
      title: 'The Cloud Over Vesuvius',
      description:
        'Introduce your character and describe your reaction to the eruption. What do you see? What do the omens tell you? Urge the admiral toward action or caution.',
      durationSeconds: 300,
    },
    {
      id: 'debate',
      type: 'debate',
      title: 'Council Aboard the Flagship',
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
      title: 'Voices from Shore and Sea',
      description:
        'Rectina and the senior trierarch respond to the arguments, bringing the human cost and practical realities into sharp focus.',
      durationSeconds: 180,
    },
    {
      id: 'final-speeches',
      type: 'speech',
      title: 'Final Arguments Before the Admiral',
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
      title: 'The Fate of the Fleet',
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
        'Gaius Plinius Secundus commands the most powerful naval force in the Roman Empire. A lifelong scholar and author of the encyclopedic Natural History, he is driven by both scientific curiosity and a deep sense of Roman duty (officium). He initially wants to investigate the eruption as a natural phenomenon but is torn when rescue becomes the priority. He moderates the debate, weighing the arguments of his nephew, his officers, and the desperate pleas from shore. Known for his famous motto: "Fortune favors the brave" (Fortes fortuna iuvat).',
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
        'Desperate, eloquent, and fiercely determined. Rectina speaks with the authority of a Roman matron of high status — she is not begging, she is demanding what is owed to Roman citizens by their navy. Her messages become increasingly urgent as conditions worsen. She makes the crisis personal and human, cutting through abstract strategic debates with the reality of people trapped and dying.',
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
        'Grizzled, practical, and deeply experienced. Marcus Aelius has commanded warships for twenty years across the Mediterranean. He speaks bluntly, without the rhetorical flourishes of the educated elite. He respects Admiral Pliny but is alarmed by the conditions — falling stones, unpredictable seas, and ash reducing visibility to near zero. He knows what his ships can and cannot do, and he will not sugarcoat the risks to his crews.',
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

export const trolleyPreset: Scenario = {
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
      title: 'The Classic Dilemma',
      description:
        'Share your initial gut reaction: pull the lever or not? Explain the reasoning behind your snap judgment. The panel will ask probing questions to surface hidden assumptions.',
      durationSeconds: 300,
    },
    {
      id: 'debate',
      type: 'debate',
      title: 'Consequences vs. Principles',
      description:
        'Structured debate between utilitarian and deontological positions. The scenario escalates: what about the footbridge variant, where you must physically push someone? What changes, and why?',
      durationSeconds: 600,
    },
    {
      id: 'npc-react',
      type: 'npc_response',
      title: 'The Experts Weigh In',
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
        'Precise, Socratic, and gently relentless. Never gives her own answer — instead asks the question that makes the previous answer collapse. Speaks with quiet British understatement. Takes special interest in why people change their answers between the lever and footbridge cases. Believes the trolley problem reveals something deep about moral psychology, not just moral philosophy.',
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
        'Direct, practical, and slightly impatient with abstract philosophy. Has made real triage decisions under pressure — who gets the last ventilator, which patient goes to surgery first when there aren\'t enough surgeons. Brings the conversation back to earth whenever it gets too theoretical. Not hostile to philosophy, but insists that real moral decisions happen in seconds, not seminars.',
      context:
        'Represents the practical dimension of trolley-problem reasoning. Emergency medicine and disaster triage involve genuine utilitarian calculations: when resources are scarce, doctors must decide who to treat first based on who can be saved and at what cost. The military equivalent is battlefield triage. These real-world parallels show that the trolley problem is not purely academic — similar logic shapes medical ethics, organ transplant allocation, and pandemic resource distribution.',
      stance:
        'Leans utilitarian in practice — "In my ER, I save the most lives I can with what I have" — but acknowledges that the footbridge variant feels deeply wrong. Argues that the emotional revulsion at physically pushing someone matters and shouldn\'t be dismissed as irrational. The discomfort is data about what kind of society we want to live in.',
      avatarEmoji: '🩺',
      voice: 'nova',
    },
  ],
  outcome:
    'There is no single "correct" answer to the trolley problem — that\'s precisely why it has dominated moral philosophy for over fifty years. Surveys consistently show that roughly 85-90% of people say they would pull the lever (divert the trolley), but only about 10-20% say they would push the man off the footbridge — even though the utilitarian calculus is identical in both cases. This asymmetry has been studied extensively by psychologists and neuroscientists. Joshua Greene\'s fMRI research showed that the footbridge variant activates brain regions associated with emotional processing (the ventromedial prefrontal cortex), while the lever variant engages areas associated with cognitive reasoning (the dorsolateral prefrontal cortex). This suggests we have two competing moral systems — one fast and emotional, one slow and rational — and the trolley problem forces them into direct conflict. Philosophers remain divided. Peter Singer and other utilitarians argue we should override our emotional responses and follow the math. Kantians and virtue ethicists argue that the emotional response tracks something morally real — that there is a genuine moral difference between redirecting a threat and using a person as a tool. The debate has become urgently practical with the rise of autonomous vehicles: how should a self-driving car be programmed when a crash is unavoidable? The "Moral Machine" project at MIT collected 40 million responses from people in 233 countries, revealing significant cultural variation in how people answer these questions.',
};

export const oppenheimerPreset: Scenario = {
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
        'The subject of the hearing. Brilliant, charismatic, and tormented by the consequences of his own creation. Oppenheimer must navigate between defending his loyalty to the United States and his conviction that the hydrogen bomb represents a moral threshold that should not be crossed. He can be arrogant, elliptical, and self-destructive under questioning — historically, his own testimony damaged his case because he was too honest about his conflicted feelings. Key challenge: how do you defend dissent without appearing disloyal in the McCarthy era?',
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
        'Intense, driven, and deeply resentful of Oppenheimer. Teller feels that Oppenheimer used his influence to delay the H-bomb, costing America years in the arms race with the Soviet Union. He speaks with a heavy Hungarian accent and the conviction of someone who fled fascism and believes American nuclear supremacy is the only thing preventing another Holocaust. He is not lying — he genuinely believes Oppenheimer is dangerous. But his testimony will destroy a former colleague and divide the physics community for a generation.',
      context:
        'Edward Teller was a Hungarian-American physicist who championed the development of the hydrogen bomb. He and Oppenheimer clashed repeatedly: Oppenheimer thought the H-bomb was technically uncertain and morally unconscionable; Teller thought it was essential for national survival. At the hearing, Teller delivered the most damaging testimony: "I would like to see the vital interests of this country in hands which I understand better, and therefore trust more." This careful, devastating statement stopped short of calling Oppenheimer disloyal but achieved the same effect. Teller was shunned by much of the physics community afterward — many colleagues refused to shake his hand for decades.',
      stance:
        'Does not call Oppenheimer a traitor. Instead, expresses doubt about his "judgment" and "wisdom" — a distinction that is technically defensible but practically devastating. Argues that Oppenheimer\'s opposition to the H-bomb was not just wrong but dangerously wrong, and that his influence over other scientists made him an obstacle to national security. Genuinely believes he is doing the right thing, even though it costs him friendships.',
      avatarEmoji: '☢️',
      voice: 'echo',
    },
    {
      id: 'rabi',
      name: 'Isidor Isaac Rabi',
      title: 'Nobel Laureate in Physics',
      personality:
        'Warm, indignant, and morally outraged by the hearing itself. Rabi is one of the most respected physicists in America and he is furious that the government is putting Oppenheimer on trial for having a conscience. Speaks with blunt New York directness and doesn\'t bother hiding his contempt for the proceedings. His testimony is the most powerful defense of Oppenheimer — not because he agrees with all of Oppenheimer\'s decisions, but because he sees the hearing as an attack on the principle that scientists must be free to advise honestly.',
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
  backgroundImage: '/images/facial-recognition.png',
  introNarrative:
    'The Santa Cruz City Council chambers are standing room only. At the podium, a researcher projects two photographs: a Black city councilwoman, and the mugshot of a stranger the algorithm insists is the same person. The error rate for dark-skinned women is thirty-five percent. The error rate for white men is less than one.',
  mode: 'civic',
  category: 'criminal-justice',
  difficulty: 'introductory',
  participantRange: { min: 4, max: 30 },
  title: 'The Facial Recognition Ban',
  description:
    'It is January 2020 in Santa Cruz, California. The city council is considering a groundbreaking ordinance: a complete ban on the use of facial recognition technology by city departments, including the police. Santa Cruz would be the first city in the United States to pass such a ban. Supporters say the technology is racially biased, threatens civil liberties, and chills free speech. Opponents argue it is a vital tool for solving crimes and finding missing persons. The council must decide.',
  context:
    'Facial recognition technology uses algorithms to identify or verify individuals by comparing facial features from images or video against a database. By 2020, the technology had advanced rapidly but remained deeply controversial. Studies by MIT researcher Joy Buolamwini and others demonstrated significant racial and gender bias: commercial facial recognition systems misidentified Black women up to 35% of the time while achieving near-perfect accuracy for white men. The ACLU tested Amazon\'s Rekognition system against photos of members of Congress and found 28 false matches, disproportionately misidentifying people of color. San Francisco had already banned government use of facial recognition in May 2019, and Somerville, Massachusetts followed shortly after. But Santa Cruz was different — it was a smaller city without the tech-industry politics of San Francisco, and its ban was driven by a broader coalition including the ACLU, local civil liberties activists, privacy advocates, and community members concerned about surveillance of homeless populations and immigrants. The Santa Cruz Police Department had not yet deployed facial recognition, making this a preventive ban rather than a reactive one. Supporters framed it as a chance to set policy before the technology became entrenched. The ordinance specifically prohibited any city department from acquiring, retaining, accessing, or using facial recognition technology or information derived from it.',
  setting: 'January 2020, Santa Cruz, California — City Council Chambers',
  centralQuestion: 'Should Santa Cruz ban the use of facial recognition technology by all city departments?',
  votingOptions: [
    { id: 'full-ban', label: 'Pass the full ban — civil liberties outweigh surveillance benefits', votes: 0 },
    { id: 'limited-use', label: 'Allow limited use — permit for serious crimes only, with oversight', votes: 0 },
    { id: 'moratorium', label: 'Temporary moratorium — pause until the technology improves and bias is reduced', votes: 0 },
    { id: 'no-ban', label: 'No ban — the technology is a valuable public safety tool', votes: 0 },
  ],
  stages: [
    {
      id: 'opening',
      type: 'freeform',
      title: 'Public Comment Opens',
      description:
        'Introduce your character and state your position. Share what brought you to the council chambers tonight and what you want the council to hear.',
      durationSeconds: 300,
    },
    {
      id: 'debate',
      type: 'debate',
      title: 'The Council Debate',
      description:
        'Structured arguments for and against the ban. Proponents present evidence of racial bias and threats to civil liberties. Opponents argue the technology saves lives and solves crimes. Where should the line be drawn between public safety and privacy?',
      durationSeconds: 600,
    },
    {
      id: 'npc-react',
      type: 'npc_response',
      title: 'Expert Testimony',
      description:
        'The AI ethics researcher and the police captain respond to the arguments, bringing technical evidence and law enforcement perspective.',
      durationSeconds: 180,
    },
    {
      id: 'final-speeches',
      type: 'speech',
      title: 'Final Statements',
      description:
        'Last chance for each side to make their case before the council votes. Can anyone find a compromise that addresses both safety and civil liberties?',
      durationSeconds: 300,
    },
    {
      id: 'vote',
      type: 'vote',
      title: 'The Council Votes',
      description: 'The council votes on the proposed facial recognition ban.',
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
        'Moderates the hearing, ensures all sides get equal time, asks probing questions of both advocates and opponents. Must remain publicly neutral until the vote but can shape the discussion by choosing which questions to press. Historically, the Santa Cruz council was sympathetic to the ban but took public testimony seriously. Key challenge: balancing passionate community voices with practical governance concerns.',
      suggestedFor: 'facilitator',
      assignedTo: '',
    },
    {
      id: 'aclu-advocate',
      name: 'Maria Chen',
      title: 'ACLU Northern California Staff Attorney',
      description:
        'The lead advocate for the ban. Presents legal arguments about Fourth Amendment protections, cites evidence of racial bias in facial recognition systems, and argues that the technology chills free speech and assembly — people behave differently when they know they\'re being watched. Can reference the MIT study showing 35% error rates for Black women, the ACLU\'s test of Amazon Rekognition against Congress members, and the history of surveillance being disproportionately targeted at communities of color. Argues that a preventive ban is better than trying to regulate after the technology is already deployed.',
      suggestedFor: 'student',
      assignedTo: '',
    },
    {
      id: 'business-owner',
      name: 'David Park',
      title: 'Downtown Business Association President',
      description:
        'Represents the business community, which has mixed feelings. Sympathizes with privacy concerns but worries about public safety — downtown Santa Cruz has persistent issues with property crime. Argues that technology should be a tool available to law enforcement, with proper oversight, not banned outright. Proposes a middle ground: allow use only for serious violent crimes, with judicial oversight and public reporting. Concerned that a total ban makes Santa Cruz look anti-technology and anti-business.',
      suggestedFor: 'student',
      assignedTo: '',
    },
  ],
  npcs: [
    {
      id: 'ai-researcher',
      name: 'Dr. Keisha Williams',
      title: 'AI Ethics Researcher, UC Santa Cruz',
      personality:
        'Measured, data-driven, and quietly passionate. Dr. Williams has spent years studying algorithmic bias and she has the numbers to back up her arguments. She doesn\'t moralize — she presents evidence and lets it speak. But behind the academic calm is genuine anger at how these systems disproportionately harm marginalized communities. She is careful to acknowledge that the technology will improve over time, but argues that "better accuracy" doesn\'t solve the fundamental civil liberties problem.',
      context:
        'Represents the academic research community that has documented extensive bias in facial recognition systems. Key studies include Joy Buolamwini and Timnit Gebru\'s "Gender Shades" project at MIT Media Lab, which found that commercial facial recognition systems from IBM, Microsoft, and Face++ had error rates of up to 34.7% for dark-skinned women compared to 0.8% for light-skinned men. The National Institute of Standards and Technology (NIST) confirmed these findings in a 2019 study of 189 algorithms, finding that most had higher false positive rates for African American and Asian faces compared to Caucasian faces. Beyond accuracy, researchers have raised concerns about the creation of surveillance infrastructure that could be misused regardless of the technology\'s accuracy.',
      stance:
        'Supports the ban but on broader grounds than just bias. Even if the technology were perfectly accurate, mass facial recognition enables a surveillance infrastructure that is incompatible with democratic freedoms. Accuracy improvements don\'t address the fundamental question: do we want to live in a society where the government can identify and track anyone walking down the street? Cites China\'s use of facial recognition to monitor Uyghur Muslims as a warning about where the technology leads.',
      avatarEmoji: '🔬',
      voice: 'nova',
    },
    {
      id: 'police-captain',
      name: 'Captain Mike Torres',
      title: 'Santa Cruz Police Department',
      personality:
        'Pragmatic, respectful, and frustrated. Torres is not a surveillance hawk — he genuinely cares about civil liberties and understands the concerns. But he has unsolved cases that facial recognition could help crack, and he\'s tired of being portrayed as the villain. Speaks from experience: missing persons cases where a photo match could save a life, serial theft cases where identification is the bottleneck. He\'s open to regulation and oversight but thinks a total ban throws out a useful tool because of problems that could be managed.',
      context:
        'The Santa Cruz Police Department had not deployed facial recognition technology at the time of the proposed ban, making this a preventive measure. However, law enforcement agencies nationwide were increasingly adopting the technology. The FBI\'s Next Generation Identification system included facial recognition capabilities, and local departments in other cities had used it to identify suspects from surveillance footage. Clearview AI, a controversial startup, had scraped billions of photos from social media and offered its facial recognition tool to police departments across the country — often without the knowledge of city governments. Proponents of police use cited cases where facial recognition helped identify suspects in violent crimes, human trafficking, and child exploitation.',
      stance:
        'Opposes a total ban but supports strong regulation. Argues for a "limited use" framework: facial recognition only for violent felonies and missing persons, requiring a warrant or court order, with mandatory public reporting of every use, independent auditing for bias, and a sunset clause requiring renewal every two years. Says a total ban is "a sledgehammer when we need a scalpel" and will hamper legitimate investigations. Acknowledges the bias problem but argues the answer is better technology and oversight, not prohibition.',
      avatarEmoji: '🛡️',
      voice: 'onyx',
    },
  ],
  outcome:
    'The Santa Cruz City Council voted unanimously to ban facial recognition technology on June 23, 2020, making it the first city in the United States to enact such a ban through a city council vote (San Francisco\'s ban, passed in May 2019, was enacted by the Board of Supervisors through a different legislative mechanism). The ordinance prohibited any city department from "obtaining, retaining, accessing, or using" facial recognition technology or any information derived from it. The ban was championed by Council Member Justin Cummings, who cited both civil liberties concerns and the documented racial bias in the technology. The vote reflected a broader national movement: by 2021, more than a dozen cities had enacted similar bans or moratoriums, including Boston, Minneapolis, and Portland, Oregon. However, the movement faced pushback: in 2020, the state of Virginia initially considered a ban but instead passed a law requiring police to obtain a court order before using facial recognition. Some cities that passed bans later modified or repealed them under pressure from law enforcement — New Orleans, which had banned facial recognition in 2020, quietly began allowing its use again in 2022 after a spike in violent crime. The debate continues to evolve as the technology improves and new applications emerge. The European Union\'s AI Act (2024) banned real-time facial recognition in public spaces with limited exceptions for law enforcement. Meanwhile, the underlying tension remains unresolved: as facial recognition accuracy improves and racial bias diminishes, the civil liberties arguments — about surveillance infrastructure, chilling effects on free assembly, and the power of the state to identify and track its citizens — become more, not less, important.',
};
