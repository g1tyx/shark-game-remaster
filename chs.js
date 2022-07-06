/*

 @name    : 锅巴汉化 - Web汉化插件
 @author  : 麦子、JAR、小蓝、好阳光的小锅巴
 @version : V0.6.1 - 2019-07-09
 @website : http://www.g8hh.com
 @idle games : http://www.gityx.com
 @QQ Group : 627141737

*/

//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //未分类：
    'Save': '保存',
    'Export': '导出',
    'Import': '导入',
    'Settings': '设置',
    'Achievements': '成就',
    'Statistics': '统计',
    'Changelog': '更新日志',
    'Hotkeys': '快捷键',
    'ALL': '全部',
    'Default': '默认',
    'AUTO': '自动',
    'default': '默认',
    "points": "点数",
    "Reset for +": "重置得到 + ",
    "Currently": "当前",
    "Effect": "效果",
    "Cost": "成本",
    "Goal:": "目标:",
    "Reward": "奖励",
    "Start": "开始",
    "Exit Early": "提前退出",
    "Finish": "完成",
    "Milestone Gotten!": "获得里程碑！",
    "Milestones": "里程碑",
    "Completed": "已完成",
    "Achievement Gotten!": "成就达成！",
    "options": "选项",
    "notice": "注意",
    "help": "帮助",
    "save": "保存",
    "reset": "重置",
    "- SHARK GAME -": "- 鲨鱼之心 -",
    "Stuff": "东西",
    "You are a shark in a strange blue sea.": "你是陌生蓝色大海中的一条鲨鱼。",
    "You can permanently disable this mode in the options menu.": "您可以在选项菜单中永久禁用此模式。",
    "You feel a bit hungry.": "你觉得有点饿。",
    "You seem to have gone inactive for more than 2 minutes!": "您似乎已超过 2 分钟不活动！",
    "Catch fish": "捕鱼",
    "changelog": "更新日志",
    "click to dismiss.": "点击关闭。",
    "credits": "鸣谢",
    "discord": "discord",
    "donate": "捐赠",
    "IDLE MODE": "放置模式",
    "Loaded game.": "游戏已加载。",
    "Log": "日志",
    "- Sharkpocalypse -": "- 鲨鱼启示录 -",
    "animals": "动物",
    "Ate a monkfish.": "吃了一条安康鱼。",
    "Ate a shark. Wait. No, it wasn't a shark.": "吃了一条鲨鱼。 等等。 不，那不是鲨鱼。",
    "Ate a swedish fish.": "吃了一条瑞典鱼。",
    "fish": "鱼",
    "Now autosaving every 5 minutes.": "现在每 5 分钟自动保存一次。",
    "Offline time is being stored in a button above the resource\n                        table.": "离线时间存储在资源表上方的按钮中。\n",
    "Recruit shark": "招募鲨鱼",
    "You attract the attention of a shark. Maybe they can help you catch fish!": "你吸引了一条鲨鱼的注意。 也许它们可以帮你抓鱼！",
    "- Strange Oceans -": "- 奇异的海洋 -",
    "Ate a kipper. Wait. Hang on.": "吃了一个腌鱼。 等待。 不挂断。",
    "Ate a marlin.": "吃了一条马林鱼。",
    "Ate a perch.": "吃了一条鲈鱼。",
    "Ate a pollock.": "吃了一条鳕鱼。",
    "Ate a salmon.": "吃了一条鲑鱼。",
    "Ate a swordfish.": "吃了一条剑鱼。",
    "Ate a trout.": "吃了一条鳟鱼。",
    "Ate a tuna.": "吃了一条金枪鱼。",
    "Ate a whitefish.": "吃了一条白鱼。",
    "Ate an anchovy.": "吃了一条凤尾鱼。",
    "Dropped the bass.": "放弃了贝斯。",
    "frenzy": "疯狂",
    "a": "一条",
    "PRODUCES": "生产",
    "Recruit a shark to help catch more fish.": "招募鲨鱼来帮助捕获更多的鱼。",
    "shark": "鲨鱼",
    "Use your natural shark prowess to find and catch a fish.": "使用您天生的鲨鱼能力来寻找和捕鱼。",
    "A atlantic torpedo ray joins you.": "大西洋鱼雷鳐加入你。",
    "A blacktip reef shark joins you.": "一条黑鳍礁鲨加入您的行列。",
    "A giant shovelnose ray joins you.": "一条巨大的铲鼻鳐加入你。",
    "A nervous shark joins you.": "一条神经过敏的鲨鱼加入你的行列。",
    "A pacific cownose ray joins you.": "一条太平洋牛鼻鳐加入您的行列。",
    "A silky shark joins you.": "一条柔滑的鲨鱼加入你的行列。",
    "A spotted stingaree joins you.": "一条斑黄貂鱼加入您的行列。",
    "A tiger shark joins you.": "一条虎鲨加入了你。",
    "at": "在",
    "Flesh of the ocean floor.": "海底的肉。",
    "Hire a ray to help collect fish. They might kick up some sand from the seabed.": "雇用鳐鱼来帮助收集鱼。 他们可能会从海底踢出一些沙子。",
    "Hire ray": "雇用鳐鱼",
    "rays": "鳐鱼",
    "ray": "鳐鱼",
    "sand": "沙子",
    "sharks": "鲨鱼",
    "Some rays drift over.": "一些鳐鱼游过。",
    "stuff": "东西",
    "TOGGLE": "切换",
    "IS PRODUCED BY": "正在生产",
    "SPEED": "速度",
    "The hunted.": "猎物。",
    "ARE PRODUCED BY": "生产于",
    "- Weird Oceans -": "- 奇异的海洋 -",
    "A crab starts sifting shiny things out of the sand.": "一只螃蟹开始从沙子里筛出闪亮的东西。",
    "A crocodile shark joins you.": "鳄鱼鲨加入了你。",
    "A dogfish joins you.": "一条狗鱼加入你。",
    "A dusky whaler shark joins you.": "一条昏暗的捕鲸鲨加入你的行列。",
    "A graceful shark joins you.": "一条优雅的鲨鱼加入您的行列。",
    "A hammerhead shark joins you.": "一条双髻鲨加入你的行列。",
    "A lemon shark joins you.": "柠檬鲨会加入你。",
    "A mako shark joins you.": "一只灰鲭鲨加入你的行列。",
    "A pigeye shark joins you.": "一只猪眼鲨加入你的行列。",
    "A puget sound king crab joins you.": "一只普吉特海湾帝王蟹加入您的行列。",
    "A purple shore crab joins you.": "一只紫色的岸蟹加入您的行列。",
    "A round stingray joins you.": "一条圆形的黄貂鱼会加入您的行列。",
    "A sliteye shark joins you.": "一条缝眼鲨加入您的行列。",
    "A spot-tail shark joins you.": "一条斑尾鲨加入您的行列。",
    "A white shark joins you.": "一条白鲨加入你。",
    "Acquire crab": "获得螃蟹",
    "An oceanic whitetip shark joins you.": "一条海洋白鳍鲨加入您的行列。",
    "Ate a bass.": "吃了一条鲈鱼。",
    "buy custom": "自定义购买",
    "buy max": "购买最大",
    "crab": "螃蟹",
    "crabs": "螃蟹",
    "- Maws -": "- 花胶 -",
    "All": "全部",
    "Basic": "基础",
    "- Lobster's Paradise -": "- 龙虾的天堂 -",
    "- NOT FINISHED -": "- 未完成 -",
    "ARE PRODUCING": "正在生产",
    "buy 1/2 max amount of things": "购买最多 1/2 的东西",
    "buy 1/3 max amount of things": "购买最多 1/3 的东西",
    "buy custom amount of things": "购买自定义数量的东西",
    "buy max amount of things": "购买最大数量的东西",
    "crystals": "水晶",
    "Dutiful, loyal crustaceans.": "尽职尽责、忠诚的甲壳类动物。",
    "Frenzy": "疯狂",
    "Jobs": "工作",
    "Kindred to the sharks.": "与鲨鱼有血缘关系。",
    "The crystals are shiny. Some sharks stare at them curiously.": "水晶闪闪发亮，一些鲨鱼好奇地盯着它们。",
    "Train science shark": "训练科学家鲨鱼",
    "- Sharkware Edition -": "- 鲨软版 -",
    "- doo doo do-do do-do -": "- 嘟嘟嘟嘟嘟嘟 -",
    "A banded stingaree joins you.": "一条带状黄貂鱼加入你。",
    "A bignose shark joins you.": "一条大鼻鲨加入你。",
    "A bluespotted maskray joins you.": "一条 蓝色斑点的面具鱼 将加入您的行列。",
    "A bulls-eye electric ray joins you.": "一条靶心电鳐加入你。",
    "A butterfly crab joins you.": "一只蝴蝶蟹加入你的行列。",
    "A clownnose ray joins you.": "一条小丑鱼会加入你。",
    "A dungeness crab joins you.": "一只珍宝蟹加入您的行列。",
    "A eastern fiddler ray joins you.": "东方提琴手鳐加入你。",
    "A flattop crab joins you.": "一只平顶蟹加入您的行列。",
    "A golf-ball crab joins you.": "一只高尔夫球蟹加入您的行列。",
    "A graceful decorator crab joins you.": "优雅的装饰蟹加入您的行列。",
    "A graceful kelp crab joins you.": "优雅的海带蟹加入您的行列。",
    "A greenmark hermit joins you.": "一位绿标隐士加入您的行列。",
    "A hardnose shark joins you.": "一只硬鼻鲨会加入你的行列。",
    "A heart crab joins you.": "一只心蟹加入你的行列。",
    "A longhorn decorator crab joins you.": "一只长角装饰蟹加入您的行列。",
    "A milk shark joins you.": "一条奶鲨加入你的行列。",
    "A moss crab joins you.": "一只青苔蟹加入你的行列。",
    "A northern kelp crab joins you.": "一只北方海带蟹加入您的行列。",
    "A ocellated torpedo joins you.": "一个单眼鱼雷加入你。",
    "A oman masked ray joins you.": "一条阿曼蒙面鳐加入您的行列。",
    "A panther torpedo ray joins you.": "黑豹鱼雷射线加入你。",
    "A red rock crab joins you.": "一只红色的岩蟹加入您的行列。",
    "A scaled crab joins you.": "一只有鳞的螃蟹加入你的行列。",
    "A shorttailed electric ray joins you.": "一条短尾电射线加入你。",
    "A sparesly-spotted stingaree joins you.": "一只零星的黄貂鱼会加入你的行列。",
    "A speartooth shark joins you.": "一条长矛鲨加入你。",
    "A spotted torpedo ray joins you.": "一条有斑点的鱼雷射线加入您的行列。",
    "A widehand hermit joins you.": "一位宽手隐士加入您的行列。",
    "Ate a carp.": "吃了一条鲤鱼。",
    "Ate a cod.": "吃了一条鳕鱼。",
    "Ate a flounder.": "吃了一条比目鱼。",
    "- Bedrock Edition -": "- 基岩版 -",
    "The SharkGame development team": "开发团队",
    "back to hub": "英文版",
    "- Bark Shark -": "- 吠鲨 -",
    "- Shoal Sharker -": "- 浅滩鲨鱼 -",
    "fun fact": "趣事",
    "New fun facts are unlocked as you see new stuff. Keep playing to unlock some!": "当你看到新的东西时，新的有趣的事实就会被解锁。 继续玩以解锁一些！",
    "A grey reef shark joins you.": "一条灰礁鲨加入您的行列。",
    "Ate a tilapia.": "吃了一条罗非鱼。",
    "Ate a yellowfin tuna.": "吃了一条黄鳍金枪鱼。",
    "- Saucy Sharks -": "- 俏皮鲨鱼 -",
    "- Next Shark Game -": "- 下一个鲨鱼游戏 -",
    "It stores offline and idle progress.": "它存储离线和放置进度。",
    "minute hand": "分针",
    "Press the button to unleash it.": "按下按钮释放它。",
    "Things start piling up around you. You can't even tell who's doing it.": "事情开始在你周围堆积起来。 你甚至无法分辨是谁在做这件事。",
    "This is the": "这是",
    "Use the slider to adjust speed.": "使用滑块调整速度。",
    "You eat a fish hooray!": "你吃了一条鱼万岁！",
    "Your vision sharpens. Your senses are keen. You can feel everything again.": "你的视野变得敏锐。 你的感官很敏锐。 你可以再次感受到一切。",
    "A porcupine ray joins you.": "一条 豪猪鳐 加入您的行列。",
    "A sandbar shark joins you.": "一条 沙洲鲨 加入你的行列。",
    "Apex predators of the seas.": "海洋的顶级掠食者。",
    "Ate a bluefish.": "吃了一条青鱼。",
    "Ate a catfish.": "吃了一条鲶鱼。",
    "Ate a goldfish.": "吃了一条金鱼。",
    "Ate a grouper.": "吃了一个石斑鱼。",
    "Ate a haddock.": "吃了一条黑线鳕。",
    "Ate a halibut.": "吃了一个大比目鱼。",
    "Ate a herring.": "吃了一条鲱鱼。",
    "Ate a mackerel.": "吃了一条鲭鱼。",
    "Ate a mullet.": "吃了一个鲻鱼。",
    "Ate a sardine.": "吃了一条沙丁鱼。",
    "Ate a sea bass.": "吃了一条鲈鱼。",
    "Ate a shark.": "吃了一条鲨鱼。",
    "Ate a snapper.": "吃了一条鲷鱼。",
    "- DUNGEONS -": "- 地下城 -",
    "A bentfin devil ray joins you.": "一条弯鳍魔鬼鱼加入你。",
    "A caribbean torpedo joins you.": "一条加勒比鱼雷加入你。",
    "A cat shark joins you.": "一条猫鲨加入你。",
    "A common stingaree joins you.": "一条黄貂鱼加入你。",
    "A cortez electric ray joins you.": "一条科尔特斯电鳐加入您的行列。",
    "A feathertail stingray joins you.": "一条羽尾黄貂鱼加入你。",
    "A green shore crab joins you.": "一只绿色的岸蟹加入您的行列。",
    "A helmet crab joins you.": "一只头盔蟹会加入你。",
    "A lesser electric ray joins you.": "一条小电鳐会加入你。",
    "A marbled ribbontail ray joins you.": "一条大理石纹带尾鳐加入您的行列。",
    "A maroon hermit joins you.": "一个栗色的隐士加入你。",
    "A orange hairy hermit joins you.": "一个橙色毛茸茸的隐士加入你。",
    "A pygmy rock crab joins you.": "一只侏儒岩蟹加入您的行列。",
    "A sea pancake joins you.": "海煎饼加入您的行列。",
    "A sharpnose crab joins you.": "一只尖鼻蟹加入你的行列。",
    "A silvertip shark joins you.": "一条银鳍鲨加入你的行列。",
    "A stingray joins you.": "黄貂鱼加入你。",
    "A umbrella crab joins you.": "一只伞蟹加入你的行列。",
    "A zebra shark joins you.": "斑马鲨加入你。",
    "Ate a mahi mahi.": "吃了一个鲯鳅。",
    "Ate a sole.": "吃了一个鞋底。",
    "Ate a tilefish.": "吃了一条方头鱼。",
    "Ate an orange roughy.": "吃了一个橘子。",
    "Compared to how fast it just was, everything seems to grind to a halt.": "与刚刚的速度相比，一切似乎都停止了。",
    "crystal": "水晶",
    "Hire a crab to find things that sharks and rays overlook.": "雇用一只螃蟹来寻找鲨鱼和鳐鱼忽视的东西。",
    "Mod of v 0.71": "v 0.71 的 Mod",
    "More sharks swim over, curious and watchful.": "更多的鲨鱼游过来，好奇而警惕。",
    "New Frontiers v 20220630a - The Volcanic Update": "New Frontiers v 20220630a - 火山更新",
    "Saved game.": "保存的游戏。",
    "Some curious crabs come over.": "一些好奇的螃蟹过来了。",
    "You approach what feels like an edge: like you could tip over at any moment, and fall deep into the abyss.": "你接近边缘的感觉：就像你随时可能翻倒，坠入深渊。",
    "You have quite the group going now.": "你现在有相当多的团队。",
    "Your new tribe is at your command!": "你的新部落听你指挥！",
    "A scientist shark is revealed!": "科学家鲨鱼被发现！",
    "After many painful years of study, a shark that has developed excellent skills in making excuses-- er, in science!": "经过多年痛苦的学习，一条鲨鱼在找借口方面已经发展出出色的技能——呃，在科学方面！",
    "Discovered Laboratory!": "发现实验室！",
    "fact:": "事实：",
    "Home Ocean": "海洋之家",
    "Inscrutable secrets in solid form.": "以坚实的形式呈现出神秘莫测的秘密。",
    "Laboratory": "实验室",
    "More people are killed by lightning every year than by sharks.": "每年被闪电杀死的人比被鲨鱼杀死的人还多。",
    "PRODUCE": "生产",
    "science": "科学",
    "science shark": "科学鲨鱼",
    "- Shark A Lark -": "- 鲨鱼云雀 -",
    ") Laboratory": ") 实验室",
    "Home Sea": "海之家",
    "science sharks": "科学鲨鱼",
    "scientific": "科学",
    "specialists": "专家",
    "The science sharks swim in their own school.": "科学鲨鱼在他们自己的学校游泳。",
    "(Change all settings to default.)": "（将所有设置更改为默认值。）",
    "(Change keybinds.)": "（更改键绑定。）",
    "(Completely wipe your main save and reset the game. COMPLETELY. FOREVER.)": "（完全清除您的主要存档并重置游戏。完全。永远。）",
    "(Create a backup save.)": "（创建备份保存。）",
    "(Draw a visual aspect tree or a more accessible aspect table?)": "（画一个可视化的方面树或更易于访问的方面表？）",
    "(How fast to update the game.)": "（更新游戏的速度。）",
    "(How much screen space the sidebar should take.)": "（边栏应该占用多少屏幕空间。）",
    "(How numbers should be formatted.)": "（数字应该如何格式化。）",
    "(How to color names of resources.)": "（如何为资源名称着色。）",
    "(Load a backup save.)": "（加载备份保存。）",
    "(Max number of messages kept in the log.)": "（日志中保留的最大消息数。）",
    "(Number of minutes between autosaves.)": "（自动保存之间的分钟数。）",
    "(Should page colors change for different planets?)": "（不同星球的页面颜色应该改变吗？）",
    "(Should resource names be bolded?)": "（资源名称应该加粗吗？）",
    "(Should the game store idle progress for later use? (otherwise, it will not go idle and will have real offline progress))": "（游戏商店是否应该闲置进度以备后用？（否则不会闲置，会有真正的离线进度））",
    "(Should the minute hand glow a ton?)": "（分针应该发光一吨吗？）",
    "(Should the tooltip only show what one of each thing produces?)": "（工具提示是否应该只显示每件事产生的结果？）",
    "(Should there be ANY offline progress?)": "（应该有任何离线进度吗？）",
    "(Should tokens display text saying where they are?)": "（令牌是否应该显示说明它们在哪里的文字？）",
    "(Should tooltips tell you much you own of stuff?)": "（工具提示应该告诉你很多你拥有的东西吗？）",
    "(Show art?)": "（展示艺术？）",
    "(Show button icons?)": "（显示按钮图标？）",
    "(Turn your save into text for other people to load, or as a backup.)": "（将您的存档转换为文本供其他人加载或作为备份。）",
    "(When using the pause button aspect, should the game not build up idle time?)": "（当使用暂停键方面，游戏不应该建立空闲时间吗？）",
    "(Where to put the log.)": "（把日志放在哪里。）",
    "(Whether to categorize resources in the table.)": "（是否对表格中的资源进行分类。）",
    "(Whether to make the stuff table smaller.)": "（是否让 stuff table 变小。）",
    "(Whether to minimize the title bar at the top.)": "（是否最小化顶部的标题栏。）",
    "(Whether to notify you of new updates.)": "（是否通知您有新的更新。）",
    "(Whether to show animated transitions.)": "（是否显示动画过渡。）",
    "(Whether to show informational tooltips when hovering over certain stuff.)": "（是否在将鼠标悬停在某些东西上时显示信息工具提示。）",
    "ACCESSIBILITY": "可访问性",
    "APPEARANCE": "外观",
    "Aspect Table or Tree:": "纵横比表或树：",
    "Autosave Frequency:": "自动保存频率：",
    "Bold Resource Names:": "粗体资源名称：",
    "A bluntnose stingray joins you.": "一条钝鼻黄貂鱼会加入您的行列。",
    "A cortez round stingray joins you.": "一条科尔特斯圆形黄貂鱼会加入你。",
    "A new insight drives a new shark to take up the cause of science!": "新的洞察力驱使新的鲨鱼投身科学事业！",
    "These guys seem to be kicking up a lot of sand!": "这些家伙似乎踢了很多沙子！",
    "- Ray of Dreams -": "- 梦想之光 -",
    "- Sailor Crab -": "- 水手蟹 -",
    "Creators of the shark future.": "鲨鱼未来的创造者。",
    "Train a shark in the fine art of research and the science of, well, science.": "训练鲨鱼研究美术和科学的科学。",
    "- what the crab doin -": "- 螃蟹在做什么 -",
    "A kiss from a shark can make you immortal. But only if they want you to be immortal.": "鲨鱼的吻可以让你永生。 但前提是他们希望你长生不老。",
    "A shark is worth one in the bush, and a bunch in the sea water. Don't put sharks in bushes.": "一条鲨鱼在灌木丛中值一条，在海水中值一堆。 不要将鲨鱼放在灌木丛中。",
    "Fun fact:": "有趣的事实：",
    "In some shark species eggs hatch within their mothers, and in some of these species the hatched babies eat unfertilised or even unhatched eggs.": "在一些鲨鱼物种中，卵在它们的母亲体内孵化，而在其中一些物种中，孵化的婴儿吃未受精甚至未孵化的卵。",
    "Magic crystals are probably not real.": "魔法水晶可能不是真的。",
    "Rays can be thought of as flattened sharks. The two are very closely related evolutionarily.": "射线可以被认为是扁平的鲨鱼。 两者在进化上密切相关。",
    "Rays are pancakes of the sea. (note: probably not true)": "鳐鱼是大海的煎饼。 （注：可能不是真的）",
    "Sharks have very rough skin, like sandpaper. In fact, shark skin was literally used as sandpaper in the past.": "鲨鱼的皮肤非常粗糙，就像砂纸一样。 事实上，鲨鱼皮在过去实际上被用作砂纸。",
    "Some shark species display 'tonic immobility' when rubbed on the nose. They stop moving, appear deeply relaxed, and can stay this way for up to 15 minutes before swimming away.": "一些鲨鱼物种在鼻子上摩擦时会表现出“强直不动”。 它们停止移动，看起来非常放松，并且可以保持这种状态长达 15 分钟，然后游走。",
    "There are many species of sharks that investigate things with their mouths. This can end badly for the subject of investigation.": "有许多种类的鲨鱼用嘴来调查事物。 对于调查对象来说，这可能会以糟糕的方式结束。",
    "There have been social behaviours observed in lemon sharks, and evidence that suggests they prefer company to being alone.": "在柠檬鲨身上观察到了社会行为，有证据表明它们更喜欢陪伴而不是独处。",
    "- The Adventure Continues -": "- 冒险继续 -",
    "Any timewalls in this game can be completely bypassed with good strategy.": "这个游戏中的任何时间墙都可以通过好的策略完全绕过。",
    "Some species of crab exhibit a kind of claw asymmetry. Called the crusher and cutter, they have different shapes that give their claws more specialized purposes.": "有些种类的螃蟹表现出一种爪不对称。 它们被称为破碎机和切割机，它们具有不同的形状，使它们的爪子具有更特殊的用途。",
    "There is a surprising deficit of cookie in this game.": "在这场比赛中，饼干出现了惊人的赤字。",
    "This game has keybinds. They are more useful than you might think. Check the options menu.": "这个游戏有键位。 它们比您想象的更有用。 检查选项菜单。",
    "Throughout history, many species crustaceans have independently evovled into crabs for no discernable reason. The phenomenon is called carcinisation.": "纵观历史，许多甲壳类动物无缘无故独立进化成螃蟹。 这种现象称为致癌。",
    "White sharks have been observed to have a variety of body language signals to indicate submission and dominance towards each other without violence.": "已经观察到白鲨具有多种肢体语言信号，以表明在没有暴力的情况下相互屈服和支配。",
    "- Fin Idle -": "- 鳍闲置 -",
    "(Effects:": "(效果:",
    "Available Upgrades": "可用升级",
    "Bite the crystals we have into something to help biting!": "我们把水晶咬成东西来帮助咬！",
    "Crystal Bite-Gear": "水晶咬合装置",
    "Crystal Containers": "水晶容器",
    "Crystal Spades": "水晶锹",
    "Fashion strange harness-tools for the rays.": "时尚奇怪的射线束工具。",
    "Make weird bottle things from the crystals we have. Maybe useful??": "用我们拥有的水晶制作奇怪的瓶子。 也许有用？？",
    "Researched Upgrades": "研究升级",
    "Sort of just off to the side, the science sharks congregate and discuss things with words you've never heard before.": "就在旁边，科学鲨鱼聚集在一起，用你以前从未听过的词讨论事情。",
    "speed × 2)": "速度 × 2)",
    "A power source for future technologies has been discovered.": "已经发现了未来技术的电源。",
    "Advances in agriculture will fuel future endeavors. Who knows what we'll do next!": "农业的进步将推动未来的努力。谁知道我们接下来会做什么！",
    "Agriculture": "农业",
    "All the goods we've acquired are now being stored and itemised in a mostly flooded cavern system. We're organized! Sort of!": "我们获得的所有货物现在都存储在一个大部分被淹没的洞穴系统中并逐项列出。我们有组织！有点！",
    "Biology": "生物学",
    "By heating things up and doing science things to them, maybe new things can be made!": "通过加热事情并对他们做科学的事情，也许可以创造出新的东西！",
    "By storing things in a centralised location, we now finally have an idea of what we're doing...sort of.": "通过将东西存储在一个集中的位置，我们现在终于知道我们在做什么......有点。",
    "Determine what it takes to plant kelp all over the seabed. Maybe this is useful.": "确定在海床上种植海带需要什么。也许这很有用。",
    "Discovered Grotto!": "发现石窟！",
    "Grotto": "石窟",
    "Investigate the boiling vents that just seem to keep on heating things up.": "调查那些似乎一直在加热的沸腾通风口。",
    "It is so much easier to get things when they're all in one place. It's like the ocean is our grotto now!": "当它们都在一个地方时，获取东西要容易得多。就像海洋现在是我们的洞穴一样！",
    "It's about time to start moving the stores we have to a better place. We've found one but it needs setting up.": "是时候开始把我们必须的商店搬到一个更好的地方了。我们找到了一个，但它需要设置。",
    "Kelp Horticulture": "海带园艺",
    "Laser Rays": "激光射线",
    "Laser rays can now be geared up to burn the very sand to glassy crystal.": "现在可以调整激光射线将沙子烧成玻璃状晶体。",
    "Not only did we find a whole bunch of weird things, the rays found that there was more sand!": "我们不仅发现了一大堆奇怪的东西，而且射线发现还有更多的沙子！",
    "Rays are twice as effective with their specially adapted digging tools.": "使用专门改装的挖掘工具，光线的效率提高了一倍。",
    "Rays are twice as effective with their understanding of the seabed and its varieties of sediment.": "射线对海床及其各种沉积物的了解是其两倍的效率。",
    "Scientists are twice as effective at making with the science.": "科学家在利用科学方面的效率是前者的两倍。",
    "- You are a Shark -": "- 你是一条鲨鱼 -",
    "(Effects: ???)": "(效果: ???)",
    "- Sharkfall -": "- 鲨鱼坠落（鲨掉） -",
    "Scientists are twice as effective with their new chemical insights.": "科学家们的新化学见解的效率提高了一倍。",
    "Seabed Geology": "海底地质",
    "Sharks are twice as effective with their new biting gear. Turns out they work better outside the mouth!": "鲨鱼使用新的咬人装备的效果是原来的两倍。 事实证明，它们在嘴外效果更好！",
    "Storage Caverns": "储藏洞穴",
    "Thermal Vents": "散热孔",
    "Transmutation": "嬗变",
    "Underwater Chemistry": "水下化学",
    "What is a shark? What is inside a shark, except for large amounts of fish?": "什么是鲨鱼？ 除了大量的鱼，鲨鱼里面还有什么？",
    "- Revenge of the Crabs -": "- 螃蟹的复仇 -",
    "(Listed below are resources, the income each resource gives you, and the total income you're getting from each thing.)": "（下面列出的是资源，每个资源给你的收入，以及你从每件事中获得的总收入。）",
    "AMOUNT": "数量",
    "Dispose of Stuff": "处理东西",
    "Disposing specialists returns them to their normal, previous lives.": "处置专家使他们恢复正常的以前的生活。",
    "General Stats": "常规统计",
    "GENERATOR": "发电机",
    "Income Details": "收入详情",
    "INCOME PER": "平均收入",
    "Real time since you began your journey:": "自您开始旅程以来的实时时间：",
    "RESOURCE": "资源",
    "rid custom": "消除自定义",
    "rid max": "消除最大",
    "Swap Producers and Produced": "交换生产者和生产者",
    "Swap to Advanced mode": "切换到高级模式",
    "The grotto is a place to keep a better track of resources.": "石窟是一个更好地跟踪资源的地方。",
    "TOTAL": "总计",
    "Total Ocean Resources Acquired": "获得的海洋资源总量",
    "You can also dispose of those you don't need anymore.": "您也可以处理不再需要的那些。",
    "- League of Lobsters -": "- 龙虾联盟 -",
    "Fun facts have always been in the game's code, but have never been exposed until this system for displaying them was added.": "有趣的事实一直存在于游戏的代码中，但直到添加了显示它们的系统后才被公开。",
    "Remoras were banished from the oceans in the long bygone eras. The sharks hope they never come back.": "在很久以前的时代，雷莫拉斯被驱逐出海洋。 鲨鱼希望它们永远不会回来。",
    "Sharks are very old, evolutionarily speaking. The first sharks emerged some time around 400 million years ago.": "从进化上讲，鲨鱼非常古老。 大约 4 亿年前，第一批鲨鱼出现了。",
    "There's nothing here.": "这里什么都没有。",
    "Apparently we could have just asked. We learned how rays make more rays. It's kinda similar to sharks, really, but rays.": "显然我们本来可以问的。 我们了解了光线如何产生更多光线。 它有点像鲨鱼，真的，但是射线。",
    "Crab-specific gear has been invented to allow for kelp farming! This is possibly useful.": "已经发明了螃蟹专用装备来养殖海带！ 这可能很有用。",
    "Crabs can become kelp farmers and grow a living carpet across the bottom of the sea.": "螃蟹可以成为海带养殖户，在海底种植一条活生生的地毯。",
    "laser ray": "激光射线",
    "planter crab": "大闸蟹",
    "Ray Biology": "射线生物学",
    "Rays and laser rays are twice as effective, and ray makers are available. We may never repair the shark-ray relations to their former state after how awkward this whole affair was.": "射线和激光射线的效果是其两倍，并且可以使用射线制造器。 在整个事件如此尴尬之后，我们可能永远无法将鲨鱼鳐鱼的关系恢复到以前的状态。",
    "- To Be Continued -": "- 未完待续 -",
    "Autosaved.": "自动保存。",
    "Sharks are twice as effective, and nurse sharks can be bought. Did you know shark eggs don't actually form just because a shark wills them to exist?": "鲨鱼的功效是两倍，可以买到护士鲨。 您是否知道鲨鱼卵实际上并不会仅仅因为鲨鱼愿意它们存在而形成吗？",
    "Sun Observation": "太阳观测",
    "We must determine what is with the weird glare on the surface of the water.": "我们必须确定水面上奇怪的眩光是什么。",
    "- Heart of Sharkness -": "- 鲨鱼之心 -",
    "A home for the stranger.": "陌生人的家。",
    "A nurse shark is ready!": "护士鲨准备好了！",
    "A ray maker is ready.": "光线制作器已准备就绪。",
    "and": "和",
    "and CONSUMES": "和消耗",
    "ARE CONSUMING": "正在消费",
    "breeders": "饲养员",
    "buy 1": "买 1",
    "buy 10": "买 10",
    "buy 100": "买100",
    "Caretakers of the helpless.": "无助者的看护者。",
    "Crab is going on a mission. A mission... to farm.": "螃蟹正在执行任务。一个任务……农场。",
    "Crab is ready to farm!": "螃蟹准备好养殖了！",
    "Crab set up with seeds.": "蟹用种子设置。",
    "Destructive forces of creation.": "破坏性的创造力量。",
    "Determine what is with these weird faceless creatures we keep finding.": "确定我们不断发现的这些奇怪的不露面生物是怎么回事。",
    "Equip a crab with the equipment and training to plant kelp across the ocean bottom.": "为螃蟹配备设备和培训，在海底种植海带。",
    "Equip laser ray": "装备激光射线",
    "Gear up planter crab": "加速种植蟹",
    "Instruct a ray maker": "指导光线制造商",
    "IS CONSUMED BY": "被消耗",
    "IS PRODUCING": "正在生产",
    "kelp": "海带",
    "Kelp produces sea apples twice as fast. We can dissect sea apples and jellyfish for science. Also, sea apple isn't a fruit. Gross.": "海带生产海苹果的速度是后者的两倍。我们可以为科学解剖海苹果和水母。此外，海苹果不是水果。总的。",
    "Laser ray online!": "镭射在线！",
    "Laser ray! With a laser ray! It's laser ray, with a laaaaaser raaaay!": "激光射线！用激光！这是激光射线，伴随着laaaaaser raaaay！",
    "laser rays": "激光射线",
    "Medical exam passed! Nurse shark is go!": "体检通过！护士鲨走了！",
    "More discoveries are needed.": "需要更多的发现。",
    "More rays lets you get more rays which you can then use to get more rays.": "更多光线可以让您获得更多光线，然后您可以使用这些光线来获得更多光线。",
    "nurse shark": "护士鲨",
    "nurse sharks": "护士鲨",
    "Planter crab equipped and ready to move a few feet and start planting some things!": "播种机螃蟹装备并准备移动几英尺并开始种植一些东西！",
    "planter crabs": "大闸蟹",
    "Producers": "生产者",
    "Ray lasered. To use a laser. Not the subject of a laser.": "雷激光。使用激光。不是激光的主题。",
    "ray maker": "光线制造商",
    "ray makers": "光线制造商",
    "Remove a ray from sand business and let them concentrate on making more rays.": "从沙子业务中移除一条射线，让他们专注于制造更多的射线。",
    "Remove a ray from sand detail and let them fuse sand into raw crystal.": "从沙子细节中移除光线，让它们将沙子融合成原始水晶。",
    "Remove a shark from fish duty and set them to shark making duty.": "将鲨鱼从鱼类职责中移除并将其设置为鲨鱼制作职责。",
    "Results inconclusive! Further research required. It could be such a benefit for science!": "结果无定论！需要进一步研究。这可能对科学有如此大的好处！",
    "Safeguarding the future.": "为未来保驾护航。",
    "sea apple": "海苹果",
    "Shark manufacturer primed.": "鲨鱼制造商准备就绪。",
    "Shell studded with kelp.": "贝壳镶嵌着海带。",
    "Stewards of an ecosystem.": "生态系统的管家。",
    "The shark community grows with time.": "鲨鱼社区随着时间的推移而发展。",
    "Train nurse shark": "训练护士鲨",
    "Xenobiology": "异种生物学",
    "A new form of material has been discovered! It has been named after its discoverer, Dr. Sharkonium.": "一种新的材料被发现了！ 它以其发现者 Sharkonium 博士的名字命名。",
    "Automation": "自动化",
    "Enables transmutation of some random junk we have lying around into sharkonium, material of the future.": "可以将我们周围的一些随机垃圾转化为未来的材料 Sharkonium。",
    "sea apples": "海苹果",
    "sharkonium": "鲨鱼藻",
    "Using sharkonium, we can make things to do things so we don't have to do the things!": "使用sharkonium，我们可以做事做事，所以我们不必做事！",
    "Exploration": "勘探",
    "Feels sort of crab-like around here.": "感觉这里有点像螃蟹。",
    "More sharks to make more sharks to make more sharks...": "更多的鲨鱼来制造更多的鲨鱼来制造更多的鲨鱼......",
    "Planter crabs are twice as effective. Is a suns worth many fish? We can see a sun, but where is it really? And what is it made of?": "播种机蟹的效果是其两倍。一个太阳值很多鱼吗？我们可以看到太阳，但它真的在哪里？它是由什么制成的？",
    "processed": "处理",
    "Processing": "加工",
    "Shark science has discovered the sun! It has also discovered that looking directly into the sun hurts.": "鲨鱼科学发现了太阳！它还发现直视太阳会很痛。",
    "Study sea apples": "研究海苹果",
    "Swim beyond the home seas to see what can be found!": "游过家乡的海洋，看看能找到什么！",
    "The cause of science is advanced!": "科学事业先进！",
    "The shark community grows!": "鲨鱼社区发展壮大！",
    "There's science inside these things, surely!": "这些东西里面肯定有科学！",
    "Transfiguration nation! ...wait.": "变身民族！ ...等待。",
    "Transmutation destination!": "蜕变目的地！",
    "Transmute stuff to sharkonium": "将东西转化为鲨鱼",
    "Why are we even doing this? Who knows! Science!": "为什么我们还要这样做？谁知道！科学！",
    "A whole bunch of sharks join you.": "一大群鲨鱼加入你。",
    "Arise, sharkonium!": "起来，鲨鱼！",
    "Carpet the seabed!": "铺在海底！",
    "Convert ordinary resources into sharkonium, building material of the future!": "将普通资源转化为鲨鱼，未来的建筑材料！",
    "Crab Biology": "螃蟹生物学",
    "Crabs are a mystery. They keep to themselves and dig up crystals or put down plants. What is even up with that? What ARE crabs??": "螃蟹是个谜。他们独处，挖掘水晶或放下植物。那是怎么回事？什么是螃蟹？？",
    "Dissect the sea apples our kelp attracts to gain additional science. Research!": "解剖我们的海带吸引的海苹果以获得更多科学知识。研究！",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",

    //树游戏
    'Loading...': '加载中...',
    'ALWAYS': '一直',
    'HARD RESET': '硬重置',
    'Export to clipboard': '导出到剪切板',
    'INCOMPLETE': '不完整',
    'HIDDEN': '隐藏',
    'AUTOMATION': '自动',
    'NEVER': '从不',
    'ON': '打开',
    'OFF': '关闭',
    'SHOWN': '显示',
    'Play Again': '再次游戏',
    'Keep Going': '继续',
    'The Modding Tree Discord': '模型树Discord',
    'You have': '你有',
    'It took you {{formatTime(player.timePlayed)}} to beat the game.': '花费了 {{formatTime(player.timePlayed)}} 时间去通关游戏.',
    'Congratulations! You have reached the end and beaten this game, but for now...': '恭喜你！ 您已经结束并通关了本游戏，但就目前而言...',
    'Main Prestige Tree server': '主声望树服务器',
    'Reach {{formatWhole(ENDGAME)}} to beat the game!': '达到 {{formatWhole(ENDGAME)}} 去通关游戏!',
    "Loading... (If this takes too long it means there was a serious error!": "正在加载...（如果这花费的时间太长，则表示存在严重错误！",
    'Loading... (If this takes too long it means there was a serious error!)←': '正在加载...（如果时间太长，则表示存在严重错误！）←',
    'Main\n\t\t\t\tPrestige Tree server': '主\n\t\t\t\t声望树服务器',
    'The Modding Tree\n\t\t\t\t\t\t\tDiscord': '模型树\n\t\t\t\t\t\t\tDiscord',
    'Please check the Discord to see if there are new content updates!': '请检查 Discord 以查看是否有新的内容更新！',
    'aqua': '水色',
    'AUTOMATION, INCOMPLETE': '自动化，不完整',
    'LAST, AUTO, INCOMPLETE': '最后，自动，不完整',
    'NONE': '无',
    'P: Reset for': 'P: 重置获得',
    'Git游戏': 'Git游戏',
    'QQ群号': 'QQ群号',
    "The above variably-named Shark Game": "The above variably-named Shark Game",
    "Cirrial": "Cirrial",
    'x': 'x',
    'All rights reserved.': 'All rights reserved.',
    "spencers145": "spencers145",
    'QQ群号:': 'QQ群号:',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',
    '': '',

}


//需处理的前缀
var cnPrefix = {
    "\n": "",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": "",
    //树游戏
    "\t\t\t": "\t\t\t",
    "\n\n\t\t": "\n\n\t\t",
    "\n\t\t": "\n\t\t",
    "\t": "\t",
    "Show Milestones: ": "显示里程碑：",
    "Autosave: ": "自动保存: ",
    "Offline Prod: ": "离线生产: ",
    "Completed Challenges: ": "完成的挑战: ",
    "High-Quality Tree: ": "高质量树贴图: ",
    "Offline Time: ": "离线时间: ",
    "Theme: ": "主题: ",
    "Anti-Epilepsy Mode: ": "抗癫痫模式：",
    "In-line Exponent: ": "直列指数：",
    "Single-Tab Mode: ": "单标签模式：",
    "Time Played: ": "已玩时长：",
    "Shift-Click to Toggle Tooltips: ": "Shift-单击以切换工具提示：",
    "(you have ": "（你有 ",
    "Recruit shark (": "招募鲨鱼（",
    "Hire ray (": "雇佣鳐鱼 (",
    "Acquire crab (": "获得螃蟹（",
    "Transmute stuff to sharkonium (": "将东西转化为鲨鱼（",
    "Study sea apples (": "研究海苹果（",
    "Train nurse shark (": "训练护士鲨 (",
    "Gear up planter crab (": "加速种植蟹 (",
    "speed × ": "速度 × ",
    "Equip laser ray (": "装备激光射线（",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需处理的后缀
var cnPostfix = {
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "",
    " ": " ",
    "\n": "",
    "\n\t\t\t": "\n\t\t\t",
    "\t\t\n\t\t": "\t\t\n\t\t",
    "\t\t\t\t": "\t\t\t\t",
    "\n\t\t": "\n\t\t",
    "\t": "\t",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^(\d+)$/,
    /^\s*$/, //纯空格
    /^([\d\.]+)e(\d+)$/,
    /^([\d\.]+)$/,
    /^\(([\d\.]+)h ([\d\.]+)m ([\d\.]+)s\)$/,
    /^ ([\d\.]+)$/,
    /^\s([\d\.]+)$/,
    /^\s([\d\.]+)K$/,
    /^([\d\.]+) K$/,
    /^([\d\.]+) M$/,
    /^([\d\.]+) B$/,
    /^([\d\.]+)s$/,
    /^([\d\.]+)x$/,
    /^x([\d\.]+)$/,
    /^([\d\.,]+)$/,
    /^\s\d+$/,
    /^([\d\.,]+)\)$/,
    /^\t([\d\.,]+)$/,
    /^([\d\.,]+)x$/,
    /^\t([\d\.]+)K$/,
    /^([\d\.]+)e([\d\.,]+)$/,
    /^e([\d\.]+)e([\d\.,]+)$/,
    /^x([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+)x$/,
    /^[\u4E00-\u9FA5]+$/
];
var cnExcludePostfix = [
]

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
//换行加空格：\n(.+)
var cnRegReplace = new Map([
    [/^([\d\.]+) hours ([\d\.]+) minutes ([\d\.]+) seconds$/, '$1 小时 $2 分钟 $3 秒'],
    [/^You are gaining (.+) elves per second$/, '你每秒获得 $1 精灵'],
    [/^You have (.+) points$/, '你有 $1 点数'],
    [/^Next at (.+) points$/, '下一个在 $1 点数'],
    [/^buy (.+) max$/, '购买最大值的 $1'],
	[/^([\d\.]+)\/sec$/, '$1\/秒'],
	[/^\+([\d\.]+)\/s$/, '\+$1\/秒'],
	[/^\-([\d\.]+)\/s$/, '\-$1\/秒'],
	[/^([\d\.,]+)\/sec$/, '$1\/秒'],
	[/^([\d\.,]+) OOMs\/sec$/, '$1 OOMs\/秒'],
	[/^([\d\.]+) OOMs\/sec$/, '$1 OOMs\/秒'],
	[/^([\d\.]+)e([\d\.,]+)\/sec$/, '$1e$2\/秒'],
    [/^requires ([\d\.]+) more research points$/, '需要$1个研究点'],
    [/^([\d\.]+)e([\d\.,]+) points$/, '$1e$2 点数'],
    [/^Dispose of (.+)$/, '处理 $1'],
    [/^rid ([\d\.]+)$/, '消除 $1'],
    [/^rid (.+) max$/, '消除最大的 $1'],
    [/^buy ([\d\.]+) amount of things$/, '购买 $1 次'],
    [/^([\d\.]+) elves$/, '$1 精灵'],
    [/^([\d\.]+)e([\d\.,]+) elves$/, '$1e$2 精灵'],
    [/^([\d\.,]+) elves$/, '$1 精灵'],
    [/^\*(.+) to electricity gain$/, '\*$1 到电力增益'],
    [/^Cost: (.+)$/, '成本：$1'],
    [/^Cost: (.+) points$/, '成本：$1 点数'],
    [/^Req: (.+) elves$/, '要求：$1 精灵'],
    [/^Req: (.+) \/ (.+) elves$/, '要求：$1 \/ $2 精灵'],
    [/^Usages: (\d+)\/$/, '用途：$1\/'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],
    // [/^(.+)([\d\.,]+)$/, '$1$2'],
    // [/^(.+)([\d\.]+)$/, '$1$2'],
    // [/^(.+)([\d\.]+)K$/, '$1$2K'],

]);