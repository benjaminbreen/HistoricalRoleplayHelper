import { Scenario, StageEvent } from './types';

export const teotihuacanPreset: Scenario = {
  backgroundImage: '/images/teotihuacan.png',
  title: 'The Fire on the Avenue of the Dead',
  description:
    'It is approximately 550 CE in Teotihuacan, the greatest city in the Americas. A devastating fire has swept the ceremonial center, destroying temples along the Avenue of the Dead. The city of over 100,000 people now faces an existential crisis: was this an act of internal revolt, divine punishment, or enemy attack? The ruling order must decide the city\'s future.',
  historicalContext:
    'Teotihuacan, located in the Basin of Mexico, has been the dominant power in Mesoamerica for centuries. At its height around 450 CE, it housed perhaps 125,000-150,000 people in a carefully planned urban grid, making it one of the largest cities in the world. The city\'s influence stretched from the Maya lowlands to western Mexico, spread through trade networks, military prestige, and religious authority centered on the worship of the Feathered Serpent (later known as Quetzalcoatl), the Great Goddess, the Storm God (Tlaloc), and the Old God of Fire. Around 550 CE, archaeological evidence shows that the city\'s ceremonial center was deliberately and systematically burned — temples, elite residences, and administrative buildings along the Avenue of the Dead were torched. Crucially, ordinary residential compounds were largely spared. This selective destruction strongly suggests an internal uprising against the ruling theocratic elite, though external factors like drought and the disruption of trade routes to the Maya region may have contributed. The city\'s art conspicuously avoids depicting individual rulers, suggesting a corporate or collective form of governance that may have fractured under stress. Apartment compounds housed multi-ethnic populations including Zapotec, Maya, and Gulf Coast communities, each with their own barrio.',
  timePeriod: 'c. 550 CE, Teotihuacan',
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
        'Characters survey the destruction and share their accounts of what happened. Who set the fires? What does this mean for the city?',
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
  studentRoles: [
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
      historicalContext:
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
      historicalContext:
        'The "Great Goddess" of Teotihuacan is one of the most debated figures in Mesoamerican studies. Depicted in elaborate murals with spiders, jaguars, and water imagery, she appears to be a powerful female deity — possibly a goddess of fertility, water, the earth, or the underworld. Some scholars argue she represents a political-religious authority separate from the Feathered Serpent cult. Her worship may have been more popular among ordinary residents than the elite-controlled temple cults. The Tepantitla murals show her presiding over a paradise of abundance.',
      stance:
        'Cryptically suggests the fire was a divine act of cleansing — the old order was corrupt, and the Great Goddess demands renewal. Does not directly endorse any political faction but implies the common people and the apartment compound communities should have more voice. Warns that rebuilding the old temples without reforming the social order will only invite another catastrophe.',
      avatarEmoji: '🕷️',
      voice: 'shimmer',
    },
  ],
  historicalOutcome:
    'Teotihuacan never recovered its former glory after the fires of c. 550 CE. The archaeological evidence is striking: the burning was selective and deliberate, targeting elite and ceremonial structures while largely sparing residential apartment compounds. This pattern strongly suggests an internal uprising against the ruling theocratic elite rather than a foreign attack. After the fire, the city entered a long decline. Population dropped dramatically over the following century, from perhaps 125,000 to around 30,000-40,000 by 650 CE. The apartment compounds continued to be inhabited, but the great temples were never rebuilt to their former scale. Political and economic power fragmented, with former Teotihuacan satellite sites like Cholula, Xochicalco, and Cacaxtla emerging as independent regional powers. Trade networks that had funneled wealth into the city broke apart. When the Aztecs encountered the ruins centuries later, they named it "Teotihuacan" — "the place where the gods were created" — believing that only divine beings could have built such a city. The memory of Teotihuacan profoundly shaped later Mesoamerican civilizations: the Aztecs modeled their own capital Tenochtitlan partly on its grid plan, and the Feathered Serpent cult continued at Cholula and elsewhere for nearly a thousand years. The lesson of Teotihuacan\'s fall — that even the mightiest city can be brought down by internal inequality and elite overreach — resonated through Mesoamerican political thought.',
};

export const axumPreset: Scenario = {
  backgroundImage: '/images/axum.png',
  title: 'The Conversion of Axum',
  description:
    'It is 340 CE in the Kingdom of Axum, one of the great powers of the ancient world. King Ezana must decide whether to adopt Christianity as the state religion — a decision that will reshape the Horn of Africa for millennia.',
  historicalContext:
    'The Kingdom of Axum (modern Ethiopia/Eritrea) controls vital Red Sea trade routes connecting Rome, India, and Arabia. Christianity has been spreading through merchant networks. The Roman Empire under Constantine recently embraced it, and his successor Constantius II is now pressuring neighboring kingdoms to follow suit — though Constantius favors the Arian interpretation of Christianity, which conflicts with the Nicene Christianity taught by Frumentius. Axum\'s traditional religion centers on a pantheon including Mahrem (god of war and the royal dynasty), Beher (god of the sea), Meder (god of the earth), and Astar (a deity akin to Venus). The king claims divine descent from Mahrem, and a powerful priestly class maintains temples and rituals. Jewish communities are also present in the region, adding another dimension to the religious landscape.',
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
  studentRoles: [
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
      historicalContext:
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
      historicalContext:
        'While the specific identity of Ezana\'s mother is not well documented, queen mothers held significant political influence in Axumite court politics, particularly during regencies. The role represents the domestic political dimension of the conversion decision — the internal power dynamics that a foreign religion would disrupt.',
      stance:
        'Cautious and pragmatic. Not opposed to Christianity in principle, but deeply worried about the pace and consequences of conversion. What happens to the noble families tied to the old temples? Will the common people accept this? Could a compromise — tolerating Christianity without making it official — preserve stability?',
      avatarEmoji: '👸',
      avatarImage: '/images/queenmother.png',
      voice: 'nova',
    },
  ],
  historicalOutcome:
    'King Ezana did convert to Christianity around 330-340 CE, making Axum one of the first states in the world to adopt Christianity as its official religion. His coins changed from displaying the disc and crescent of the traditional gods to the cross. When Emperor Constantius II sent a letter demanding that Frumentius be sent to Alexandria for "re-examination" by an Arian bishop, Ezana refused — asserting Axum\'s religious independence from Rome. The Ethiopian Orthodox Church, tied to the Alexandrian (Coptic) tradition, became one of the oldest Christian institutions in the world, profoundly shaping Ethiopian culture, art, and politics for over 1,600 years. However, traditional practices were not immediately eliminated — they blended with Christianity in complex ways that scholars still study today. The old gods faded slowly, and elements of pre-Christian belief persisted in folk practice for centuries.',
};

export const pompeiiPreset: Scenario = {
  backgroundImage: '/images/pompeii.png',
  title: "Pliny's Decision at Misenum",
  description:
    'It is the afternoon of August 24, 79 CE. A strange cloud shaped like an umbrella pine has risen from Mount Vesuvius, visible from the naval base at Misenum across the Bay of Naples. Admiral Gaius Plinius Secundus — Pliny the Elder — commands the Roman imperial fleet. As ash begins to fall and desperate messages arrive from the coast, he must decide: should the fleet sail toward the eruption to attempt a rescue?',
  historicalContext:
    'Pliny the Elder (23-79 CE) was one of the most remarkable figures of the Roman world: a naval commander, natural philosopher, and author of the encyclopedic Natural History in 37 volumes. As prefect of the Misene fleet (praefectus classis Misenensis), he commanded the largest naval squadron in the Roman Empire, stationed at Misenum on the northern arm of the Bay of Naples. On August 24, 79 CE, his seventeen-year-old nephew Pliny the Younger was studying with him when they observed an enormous eruption column rising from Vesuvius. The elder Pliny initially wanted to investigate as a scientist, but when he received a desperate message from Rectina, a friend trapped near the volcano, he ordered the fleet to launch a rescue mission. The eruption of Vesuvius in 79 CE was a complex, multi-phase event. It began with a Plinian eruption column reaching 33 km into the stratosphere, raining pumice and ash. After roughly 12 hours, the column collapsed, generating pyroclastic surges — superheated clouds of gas, ash, and rock traveling at up to 700 km/h — that destroyed Herculaneum and eventually Pompeii. The coastal waters were disrupted by the eruption, with unusual wave patterns and the sea retreating in places, exposing the harbor floor.',
  timePeriod: 'August 24, 79 CE, Misenum, Bay of Naples',
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
        'Characters observe the strange cloud rising from Vesuvius and share their initial reactions. What is this phenomenon? Is it a sign from the gods? How dangerous could it be?',
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
  studentRoles: [
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
      historicalContext:
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
      historicalContext:
        'The Misene fleet (Classis Misenensis) was one of two major imperial fleets based in Italy, consisting of large warships (quadriremes and triremes) as well as lighter Liburnian galleys. A trierarch was the captain of an individual warship. The fleet had roughly 10,000 sailors and marines. While primarily a military force, the fleet also served civilian functions including transport and, in emergencies, evacuation. The ships were oar-powered galleys that could navigate independently of wind but were vulnerable to falling debris and shallow, disrupted waters.',
      stance:
        'Cautiously pragmatic. Does not refuse the mission but insists on honesty about the risks. The lighter Liburnian galleys might reach the coast, but the heavy quadriremes risk grounding in disrupted waters. If the admiral orders the fleet out, Marcus Aelius will obey — but he wants everyone to understand that ships and crews may be lost. Recommends a smaller rescue force rather than the entire fleet.',
      avatarEmoji: '⚓',
      voice: 'onyx',
    },
  ],
  historicalOutcome:
    'Pliny the Elder did sail. He ordered the full fleet to launch, reportedly declaring "Fortes fortuna iuvat" — Fortune favors the brave. He initially headed for Rectina\'s villa but found landing impossible due to falling debris and the altered shoreline. He diverted south to Stabiae, where his friend Pomponianus had a villa. There, Pliny tried to calm the terrified household, bathing and dining as if nothing were wrong. He fell asleep (or lost consciousness) and had to be woken when the courtyard began filling with pumice, threatening to block the doors. The group fled to the beach with pillows tied to their heads against the falling stones. But the sea was too rough to launch, and toxic volcanic gases — likely sulfur dioxide and carbon dioxide — rolled across the shore. Pliny, who suffered from respiratory problems, collapsed and died on the beach on the morning of August 25. His body was found two days later, intact, "looking more like a man asleep than dead," according to his nephew. Pliny the Younger, who had stayed behind at Misenum, survived the eruption and later wrote two extraordinary letters to the historian Tacitus describing both his uncle\'s death and his own harrowing experience as the eruption reached Misenum itself. These letters (Epistulae VI.16 and VI.20) became the only surviving ancient eyewitness account of a major volcanic eruption and are so detailed that volcanologists named the eruption type "Plinian" in his honor. The eruption killed an estimated 16,000 people and buried Pompeii, Herculaneum, Stabiae, and Oplontis under meters of volcanic material.',
};
