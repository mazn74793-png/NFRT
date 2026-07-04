import { MenuCategory } from "../types";

export const POETIC_STORY = {
  textEn: `In a world that moves too fast, we turn toward the echoes of what built us — toward roots that never fade, and a heritage that still breathes through us. Here, comfort is intention not coincidence; flavors crafted with care, drinks shaped with calm, spaces made for families, friends, and every soul seeking a moment of ease. Quality stands at the core, warmth fills the air, and a quiet sense of belonging waits for anyone who enters. A place born from our past, designed for our present, and created for those who wish to feel at home again.`,
  textAr: `في عالم يتحرك بسرعة مفرطة، نلتفت نحو أصداء ما بنانا — نحو جذور لا تبهت أبدًا، وتراث لا يزال يتنفس من خلالنا. هنا، الراحة مقصودة وليست مصادفة؛ نكهات صيغت بعناية، مشروبات شُكّلت بهدوء، ومساحات صُنعت للعائلات، والأصدقاء، ولكل روح تبحث عن لحظة طمأنينة. الجودة تكمن في الجوهر، الدفء يملأ الأرجاء، وشعور هادئ بالانتماء ينتظر كل من يخطو إلى الداخل. مكان وُلد من ماضينا، صُمم لحاضرنا، وصُنع لأولئك الذين يرغبون في الشعور بالدفء والبيت مجددًا.`
};

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: "main_course",
    nameEn: "Main Course",
    nameAr: "الأطباق الرئيسية",
    icon: "Utensils",
    items: [
      {
        id: "mc1",
        nameEn: "Grilled Chicken",
        nameAr: "دجاج مشوي",
        descriptionEn: "Grilled chicken breasts served with white sauce, mushrooms, and 2 side dishes of your choice.",
        descriptionAr: "صدور دجاج مشوية تقدم مع وايت صوص، مشروم، و 2 سايد من اختيارك.",
        price: 355,
        tags: ["Best Seller", "Signature"],
        image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "mc2",
        nameEn: "Chicken Curry",
        nameAr: "تشيكن كاري",
        descriptionEn: "Chicken cubes cooked with curry powder, red & yellow pepper cubes, apple slices, white sauce, and served with 2 side dishes.",
        descriptionAr: "قطع دجاج مطهوة مع كاري باودر، فلفل ألوان، شرائح تفاح، وايت صوص، وتقدم مع 2 سايد من اختيار العميل.",
        price: 370,
        tags: ["Spicy Accent"],
        image: "https://images.unsplash.com/photo-1631292780214-c3e8d9c2830c?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "mc3",
        nameEn: "Cordon Bleu",
        nameAr: "كوردون بلو",
        descriptionEn: "Stuffed rolled chicken breast with rich cheese and cold cuts, deep fried, topped with custom sauce, and served with 2 side dishes.",
        descriptionAr: "قطعة كوردون بلو محشية غنية بالجبن واللحوم الباردة مع صوص خاص، تقدم مع 2 سايد من اختيار العميل.",
        price: 370,
        tags: ["Premium"],
        image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "mc4",
        nameEn: "Chicken & Shrimp",
        nameAr: "تشيكن آند شريمب",
        descriptionEn: "Combination of grilled chicken breasts and tender shrimp, white sauce, fresh mushroom, white pepper, and served with 2 side dishes.",
        descriptionAr: "مزيج صدور الدجاج المشوية والجمبري الطازج، فلفل أبيض، وايت صوص، مشروم، تقدم مع 2 سايد من اختيار العميل.",
        price: 440,
        tags: ["Luxury", "Seafood Twist"],
        image: "https://images.unsplash.com/photo-1510627802775-3f930a37e19f?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "mc5",
        nameEn: "Beef Fillet",
        nameAr: "بيف فيليه",
        descriptionEn: "Premium tender beef fillet cooked with demi-glace sauce, fresh mushroom, served with 2 side dishes.",
        descriptionAr: "قطعة لحم فيليه فاخرة مطهوة بصوص الديميجلاس والمشروم الطازج، تقدم مع 2 سايد من اختيار العميل.",
        price: 420,
        tags: ["Chef Special"],
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600"
      }
    ]
  },
  {
    id: "pasta",
    nameEn: "Pasta",
    nameAr: "المكرونة والباستا",
    icon: "ChefHat",
    items: [
      {
        id: "pst1",
        nameEn: "Seafood Pasta",
        nameAr: "باستا سي فود",
        descriptionEn: "Penne pasta with fresh shrimp, calamari, mussels in a creamy white or red herb sauce.",
        descriptionAr: "مكرونة بيني مع الجمبري الطازج، الكاليماري، بلح البحر في صوص الكريمة الأبيض أو صوص الطماطم بالأعشاب.",
        price: 380,
        tags: ["Seafood"],
        image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "pst2",
        nameEn: "Pasta Alfredo",
        nameAr: "باستا ألفريدو دجاج ومشروم",
        descriptionEn: "Fettuccine pasta in rich buttery parmesan cream sauce with grilled chicken and mushrooms.",
        descriptionAr: "مكرونة فوتشيني بصوص الكريمة الغني والبارميجان مع قطع الدجاج المشوية والمشروم.",
        price: 290,
        tags: ["Classic"],
        image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&q=80&w=600"
      }
    ]
  },
  {
    id: "soup",
    nameEn: "Soup",
    nameAr: "الشوربة",
    icon: "Coffee",
    items: [
      {
        id: "sp1",
        nameEn: "Creamy Mushroom Soup",
        nameAr: "شوربة الفطر بالكريمة",
        descriptionEn: "Freshly pureed wild mushrooms with aromatic herbs and thick rich cream.",
        descriptionAr: "شوربة الفطر البري المهروسة مع الأعشاب العطرية والكريمة الغنية.",
        price: 150,
        image: "https://images.unsplash.com/photo-1547592165-e1d17fed6005?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "sp2",
        nameEn: "Orzo Soup",
        nameAr: "شوربة لسان عصفور",
        descriptionEn: "Traditional Egyptian orzo pasta cooked in rich chicken broth with a squeeze of fresh lemon.",
        descriptionAr: "شوربة لسان العصفور المصرية التقليدية المطهوة في مرق الدجاج الغني مع ليمون طازج.",
        price: 120,
        image: "https://images.unsplash.com/photo-1607532941433-304659e8198a?auto=format&fit=crop&q=80&w=600"
      }
    ]
  },
  {
    id: "sandwiches",
    nameEn: "Sandwiches",
    nameAr: "السندوتشات",
    icon: "Layers",
    items: [
      {
        id: "snd1",
        nameEn: "Club Sandwich",
        nameAr: "كلوب ساندوتش",
        descriptionEn: "Triple-decker toast filled with grilled chicken, smoked beef, egg, cheese, fresh lettuce, and tomatoes with mayonnaise.",
        descriptionAr: "توست ثلاثي الطبقات محشو بالدجاج المشوي، البقر المدخن، البيض، الجبن، الخس الطازج، والطماطم مع المايونيز.",
        price: 240,
        image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "snd2",
        nameEn: "Philly Steak Sandwich",
        nameAr: "ساندوتش فيلي ستيك",
        descriptionEn: "Sautéed ribeye steak strips, onions, bell peppers, melted cheddar and mozzarella cheese in a soft baguette.",
        descriptionAr: "شرائح لحم ريب آي مشوحة مع البصل، الفلفل الألوان، وجبن التشيدر والموتزاريلا الذائبة في خبز باجيت سبيشيال.",
        price: 310,
        tags: ["Popular"],
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=600"
      }
    ]
  },
  {
    id: "pizza",
    nameEn: "Pizza",
    nameAr: "البيتزا",
    icon: "Flame",
    items: [
      {
        id: "pz1",
        nameEn: "Margherita Pizza",
        nameAr: "بيتزا مارجريتا",
        descriptionEn: "A classic with Italian tomato sauce, fresh buffalo mozzarella, olive oil, and fresh basil leaves.",
        descriptionAr: "كلاسيكية بصوص الطماطم الإيطالي، جبن الموتزاريلا الفريش، زيت زيتون، وأوراق الريحان الطازجة.",
        price: 220,
        image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "pz2",
        nameEn: "Quattro Formaggi",
        nameAr: "بيتزا أربع أجبان",
        descriptionEn: "Gorgonzola, parmesan, pecorino, and creamy mozzarella with white truffle oil drizzle.",
        descriptionAr: "مزيج من جبن الجورجونزولا، البارميجان، البيكورينو، والموتزاريلا الكريمية مع زيت الترافل الأبيض.",
        price: 280,
        image: "https://images.unsplash.com/photo-1573821663912-569905455b1c?auto=format&fit=crop&q=80&w=600"
      }
    ]
  },
  {
    id: "salad",
    nameEn: "Salad",
    nameAr: "السلطات",
    icon: "Leaf",
    items: [
      {
        id: "sl1",
        nameEn: "Caesar Salad",
        nameAr: "سلطة سيزر بالدجاج",
        descriptionEn: "Crisp romaine lettuce tossed in creamy Caesar dressing, parmesan flakes, garlic croutons, topped with grilled chicken breasts.",
        descriptionAr: "خس روماني مقرمش مع دريسنج السيزر الغني، رقائق البارميجان، الكروتون بالثوم، مغطاة بصدور دجاج مشوية.",
        price: 180,
        image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "sl2",
        nameEn: "Greek Salad",
        nameAr: "سلطة يونانية",
        descriptionEn: "Fresh cucumbers, vine tomatoes, red onion, kalamata olives, and rich feta cheese blocks, dressed with extra virgin olive oil and oregano.",
        descriptionAr: "خيار طازج، طماطم، بصل أحمر، زيتون كالاماتا، مكعبات جبنة فيتا فاخرة، مع زيت الزيتون البكر والزعتر البري.",
        price: 160,
        image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600"
      }
    ]
  },
  {
    id: "breakfast",
    nameEn: "Breakfast",
    nameAr: "الفطور",
    icon: "Sun",
    items: [
      {
        id: "bf1",
        nameEn: "NFRT Royal Breakfast",
        nameAr: "فطور نفرتيتي الملكي",
        descriptionEn: "Your choice of premium eggs (omelette or sunny side up), served with beef bacon, grilled sausages, sautéed mushrooms, hash browns, and fresh basket of toast.",
        descriptionAr: "اختيارك من البيض الفاخر (أومليت أو عيون)، يُقدم مع بيكون بقري، سجق مشوي، مشروم سوتيه، هاش براونز، وسلة توست طازج.",
        price: 260,
        tags: ["Royal"],
        image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "bf2",
        nameEn: "Croissant Benedict",
        nameAr: "كرواسون بنديكت",
        descriptionEn: "Warm flaky butter croissant stuffed with poached eggs, smoked turkey, spinach, topped with rich warm Hollandaise sauce.",
        descriptionAr: "كرواسون زبدة دافئ وهش محشو بالبيض البوشيه، تركي مدخن، سبانخ، ومغطى بصوص الهولنديز الغني.",
        price: 190,
        image: "https://images.unsplash.com/photo-1600431521340-491eca880813?auto=format&fit=crop&q=80&w=600"
      }
    ]
  },
  {
    id: "hot_classic_coffee",
    nameEn: "Hot Classic Coffee",
    nameAr: "القهوة الساخنة الكلاسيكية",
    icon: "Bean",
    items: [
      {
        id: "hc1",
        nameEn: "Espresso (Single / Double)",
        nameAr: "اسبريسو (سنجل / دبل)",
        descriptionEn: "Intense, aromatic shot of our premium 100% Arabica roasted house blend.",
        descriptionAr: "جرعة مركزة وعطرية من حبوب البن الفاخرة المحمصة لدينا بنسبة 100% أرابيكا.",
        price: 80,
        image: "https://images.unsplash.com/photo-1510707577719-0d859b09fd16?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "hc2",
        nameEn: "Cappuccino",
        nameAr: "كابتشينو",
        descriptionEn: "Classic balance of espresso, steamed warm milk, and deep velvet foam layer.",
        descriptionAr: "توازن مثالي بين الاسبريسو، الحليب الساخن، وطبقة غنية من الرغوة المخملية.",
        price: 110,
        image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "hc3",
        nameEn: "Turkish Coffee",
        nameAr: "قهوة تركي",
        descriptionEn: "Traditionally brewed premium roasted Turkish coffee beans with cardamon, served with a sweet water chaser and Turkish delight.",
        descriptionAr: "قهوة تركية فاخرة محضرة بالطريقة التقليدية مع الحبهان، تقدم مع كأس مياه وحلوى راحة الحلقوم.",
        price: 75,
        image: "https://images.unsplash.com/photo-1570968915860-54d5c301fc9f?auto=format&fit=crop&q=80&w=600"
      }
    ]
  },
  {
    id: "hot_classic_drink",
    nameEn: "Hot Classic Drink",
    nameAr: "المشروبات الساخنة الكلاسيكية",
    icon: "Sparkles",
    items: [
      {
        id: "hd1",
        nameEn: "Premium Hot Chocolate",
        nameAr: "هوت شوكليت فاخر",
        descriptionEn: "Rich melted Belgian chocolate steamed with fresh full cream milk, topped with mini marshmallows and chocolate shavings.",
        descriptionAr: "شوكولاتة بلجيكية فاخرة مذابة مع حليب طازج كامل الدسم، تعلوها قطع المارشميلو ورقائق الشوكولاتة.",
        price: 120,
        image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "hd2",
        nameEn: "Organic Green Tea with Mint",
        nameAr: "شاي أخضر عضوي بالنعناع",
        descriptionEn: "Freshly brewed loose-leaf organic green tea infused with fresh Egyptian mint.",
        descriptionAr: "شاي أخضر عضوي مستخلص من أوراق الشاي الكاملة مع النعناع المصري الطازج.",
        price: 70,
        image: "https://images.unsplash.com/photo-1522041314723-0a370844330f?auto=format&fit=crop&q=80&w=600"
      }
    ]
  },
  {
    id: "frappe",
    nameEn: "Frappe",
    nameAr: "فرابيه",
    icon: "IceCream",
    items: [
      {
        id: "frp1",
        nameEn: "Caramel Macchiato Frappe",
        nameAr: "كراميل ماكياتو فرابيه",
        descriptionEn: "Blended espresso with cold milk, premium caramel syrup, crushed ice, topped with thick whipped cream and caramel drizzle.",
        descriptionAr: "اسبريسو ممزوج مع حليب بارد، سيرب كراميل بريميوم، ثلج مجروش، تعلوه الكريمة المخفوقة وصوص الكراميل.",
        price: 140,
        image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "frp2",
        nameEn: "Dark Chocolate Mocha Frappe",
        nameAr: "شوكولاتة داكنة موكا فرابيه",
        descriptionEn: "Blended double espresso shot, gourmet chocolate sauce, cold milk, and crushed ice, crowned with chocolate cream.",
        descriptionAr: "اسبريسو دبل شوت ممزوج مع صوص الشوكولاتة الفاخرة، حليب بارد وثلج مجروش، مغطى بكريمة الشوكولاتة.",
        price: 145,
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600"
      }
    ]
  },
  {
    id: "ice_coffee",
    nameEn: "Ice Coffee",
    nameAr: "القهوة المثلجة",
    icon: "GlassWater",
    items: [
      {
        id: "ic1",
        nameEn: "Iced Spanish Latte",
        nameAr: "سبانش لاتيه مثلج",
        descriptionEn: "Double shot of premium espresso poured over cold sweet condensed milk, fresh milk, and ice.",
        descriptionAr: "جرعة مضاعفة من الاسبريسو الفاخر فوق حليب مكثف محلى بارد، حليب طازج وثلج.",
        price: 115,
        tags: ["Highly Recommended"],
        image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "ic2",
        nameEn: "Iced Caramel Americano",
        nameAr: "آيس كراميل أمريكانو",
        descriptionEn: "Espresso double shot with cold water, a dash of rich caramel syrup, served over ice rocks.",
        descriptionAr: "اسبريسو دبل شوت مع مياه باردة، لمسة من سيرب الكراميل الغني، تقدم فوق مكعبات الثلج.",
        price: 95,
        image: "https://images.unsplash.com/photo-1510707577719-0d859b09fd16?auto=format&fit=crop&q=80&w=600"
      }
    ]
  },
  {
    id: "ice_tea",
    nameEn: "Ice Tea",
    nameAr: "الشاي المثلج",
    icon: "GlassWater",
    items: [
      {
        id: "it1",
        nameEn: "Peach Passion Ice Tea",
        nameAr: "شاي مثلج بالخوخ والباشن",
        descriptionEn: "Fresh brewed black tea cooled and shaken with sweet peach syrup, fresh lemon squeeze, and ice rocks.",
        descriptionAr: "شاي أسود طازج مبرد ومخفوق مع سيرب الخوخ الحلو، عصير ليمون طازج ومكعبات الثلج.",
        price: 100,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "it2",
        nameEn: "Lemon Mint Ice Tea",
        nameAr: "شاي مثلج بالليمون والنعناع",
        descriptionEn: "Refreshing house-brewed black tea shaken with fresh mint leaves and squeezed lemon.",
        descriptionAr: "شاي أسود منعش محضر منزلياً مخفوق مع أوراق النعناع الطازجة وعصير الليمون.",
        price: 100,
        image: "https://images.unsplash.com/photo-1522041314723-0a370844330f?auto=format&fit=crop&q=80&w=600"
      }
    ]
  },
  {
    id: "juice",
    nameEn: "Juice",
    nameAr: "العصائر الطبيعية",
    icon: "GlassWater",
    items: [
      {
        id: "jc1",
        nameEn: "Fresh Egyptian Mango",
        nameAr: "عصير مانجو مصري طازج",
        descriptionEn: "Pure thick juice squeezed from the finest seasonal Egyptian mangoes.",
        descriptionAr: "عصير بيور مكثف معصور من أفضل ثمار المانجو المصرية الموسمية الفاخرة.",
        price: 110,
        tags: ["Fresh"],
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "jc2",
        nameEn: "Fresh Strawberry & Mint Juice",
        nameAr: "عصير فراولة بالنعناع طازج",
        descriptionEn: "Sweet seasonal strawberries blended fresh with a hint of cooling mint leaves.",
        descriptionAr: "فراولة حلوة موسمية ممزوجة طازجة مع لمسة من أوراق النعناع المنعشة.",
        price: 95,
        image: "https://images.unsplash.com/photo-1510627802775-3f930a37e19f?auto=format&fit=crop&q=80&w=600"
      }
    ]
  },
  {
    id: "chiller",
    nameEn: "Chiller",
    nameAr: "تشيلر وموهيتو",
    icon: "Droplets",
    items: [
      {
        id: "ch1",
        nameEn: "Blue Lagoon Mojito",
        nameAr: "بلو لاجون موهيتو",
        descriptionEn: "Sparkling soda with blue curacao syrup, fresh lime wedges, refreshing mint leaves, and lots of crushed ice.",
        descriptionAr: "صودا فوارة مع سيرب البلو كوراساو، قطع الليمون الطازجة، أوراق النعناع المنعشة، والكثير من الثلج المجروش.",
        price: 130,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "ch2",
        nameEn: "Sunset Peach Chiller",
        nameAr: "صن سيت بيتش تشيلر",
        descriptionEn: "Layers of sweet peach puree, fresh orange juice, and a splash of grenadine served over ice.",
        descriptionAr: "طبقات من بيوريه الخوخ الحلو، عصير البرتقال الطازج، ولمسة من الجرينادين تُقدم فوق الثلج.",
        price: 135,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600"
      }
    ]
  },
  {
    id: "milk_shake",
    nameEn: "Milk Shake",
    nameAr: "الميلك شيك",
    icon: "IceCream",
    items: [
      {
        id: "ms1",
        nameEn: "Vanilla Lotus Dream Shake",
        nameAr: "ميلك شيك فانيليا ولوتس",
        descriptionEn: "Creamy vanilla bean ice cream blended with Belgian Lotus biscuit spread, whole cookies, topped with whipped cream and cookie crumbs.",
        descriptionAr: "آيس كريم الفانيليا الغني ممزوج مع زبدة اللوتس البلجيكية، بسكويت لوتس كامل، مغطى بالكريمة المخفوقة وفتات البسكويت.",
        price: 150,
        tags: ["Best Seller"],
        image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "ms2",
        nameEn: "Dark Chocolate & Brownie Shake",
        nameAr: "ميلك شيك شوكولاتة داكنة وبراوني",
        descriptionEn: "Premium rich dark chocolate ice cream blended with real chocolate fudge brownie chunks and cold milk.",
        descriptionAr: "آيس كريم الشوكولاتة الداكنة الفاخر ممزوج مع قطع كيك البراوني الغني بالحليب البارد.",
        price: 145,
        image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=600"
      }
    ]
  },
  {
    id: "smoothie",
    nameEn: "Smoothie",
    nameAr: "السموذي",
    icon: "Droplet",
    items: [
      {
        id: "sm1",
        nameEn: "Berry Blast Smoothie",
        nameAr: "سموذي التوت المشكل",
        descriptionEn: "A thick energetic blend of blueberries, raspberries, strawberries, yogurt, and wild mountain honey.",
        descriptionAr: "مزيج غني بالطاقة من التوت الأزرق، التوت الأحمر، الفراولة، الزبادي، وعسل جبل بري طبيعي.",
        price: 140,
        image: "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "sm2",
        nameEn: "Mango Passionfruit Smoothie",
        nameAr: "سموذي المانجو والباشن فروت",
        descriptionEn: "Tropical blend of pure mango nectar with exotic passionfruit seeds and squeezed lime.",
        descriptionAr: "مزيج استوائي من نكتار المانجو البيور مع بذور الباشن فروت وعصير الليمون المنعش.",
        price: 145,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600"
      }
    ]
  },
  {
    id: "desserts",
    nameEn: "Desserts",
    nameAr: "الحلويات",
    icon: "Cake",
    items: [
      {
        id: "ds1",
        nameEn: "Molten Lava Chocolate Cake",
        nameAr: "مولتن لافا كيك الشوكولاتة",
        descriptionEn: "Baked warm chocolate cake with a rich liquid Belgian chocolate center, served with a scoop of premium vanilla ice cream.",
        descriptionAr: "كيك شوكولاتة دافئ يخبز بحشوة سائلة من الشوكولاتة البلجيكية، يُقدم مع بولة آيس كريم فانيليا فاخرة.",
        price: 170,
        image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "ds2",
        nameEn: "Pharaoh's Salted Caramel Cheesecake",
        nameAr: "تشيز كيك الكراميل المملح",
        descriptionEn: "Silky New York style baked cheesecake on a golden graham cracker crust, blanketed in rich house-made salted caramel.",
        descriptionAr: "تشيز كيك نيويورك مخبوزة وقوام حريري على قاعدة ذهبية من بسكويت دايجستف، مغطاة بالكراميل المملح المحضر منزلياً.",
        price: 160,
        image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=600"
      }
    ]
  },
  {
    id: "nfrt_signature",
    nameEn: "NFRT Signature",
    nameAr: "نفرتيتي سيجنتشر",
    icon: "Crown",
    items: [
      {
        id: "sig1",
        nameEn: "Golden Nefertiti Brew",
        nameAr: "مشروب نفرتيتي الذهبي",
        descriptionEn: "A high-end, rich double-espresso infused with luxury condensed milk, custom warm spices, and topped with authentic, edible gold flakes. Served in a golden chalice.",
        descriptionAr: "اسبريسو مزدوج فاخر ممزوج بحليب مكثف ومجموعة بهارات دافئة خاصة بالملوك الفراعنة، تعلوه رقائق الذهب عيار 24 الصالحة للأكل.",
        price: 190,
        tags: ["Gold Standard", "Royal Pick"],
        image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=600"
      },
      {
        id: "sig2",
        nameEn: "The Pharaonic Feast Dessert",
        nameAr: "حلوى الوليمة الفرعونية",
        descriptionEn: "Layered crispy puff pastry infused with rich clotted cream, premium Lotus cream, crushed roasted pistachio, and drizzled with ancient Egyptian mountain honey.",
        descriptionAr: "طبقات من البف باستري المقرمش مع القشطة الطازجة الغنية، كريمة اللوتس البريميوم، الفستق الحلبي المحمص، وعسل جبلي طبيعي.",
        price: 220,
        tags: ["Exclusive"],
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600"
      }
    ]
  }
];
