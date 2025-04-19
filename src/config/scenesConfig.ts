type CallbackButton = {
  type: 'callback';
  key: string;
  label: string;
};

type UrlButton = {
  type: 'url';
  url: string;
  label: string;
};

type Separator = { type: 'separator' };

type productKeyboardArrayType = {
  type: 'callback';
  label: string;
  key: { type: string; name: string };
};


type KeyboardButton = CallbackButton | UrlButton | Separator | productKeyboardArrayType;

type scenesConfig = {
  text: string;
  image: string;
  keyboard: KeyboardButton[];
}


type Product = {
  name: string,
  cost: number,
  image: string
};

const products: Product[][] = [
  [
    {
      name: 'Novice',
      cost: 299,
      image: 'https://cs6.pikabu.ru/post_img/big/2015/06/08/3/1433735650_472905306.jpg',
    },
    {
      name: 'Novice',
      cost: 299,
      image: 'https://cs6.pikabu.ru/post_img/big/2015/06/08/3/1433735650_472905306.jpg',
    },
    {
      name: 'Novice',
      cost: 299,
      image: 'https://cs6.pikabu.ru/post_img/big/2015/06/08/3/1433735650_472905306.jpg',
    },
    {
      name: 'Novice',
      cost: 299,
      image: 'https://cs6.pikabu.ru/post_img/big/2015/06/08/3/1433735650_472905306.jpg',
    }
  ],
  [
    {
      name: 'Тотем',
      cost: 299,
      image: 'https://cs6.pikabu.ru/post_img/big/2015/06/08/3/1433735650_472905306.jpg',
    },
    {
      name: 'Тотем2',
      cost: 299,
      image: 'https://cs6.pikabu.ru/post_img/big/2015/06/08/3/1433735650_472905306.jpg',
    }
  ]
]

const productKeyboard = () => {

  let productKeyboardArray: KeyboardButton[] = [];

  for (let i = 0; i < products.length; i++) {
    const row = products[i]!.map((item: Product) => (
      {
        type: 'callback',
        key: {
          type: 'product',
          name: item.name,
        },
        label: item.name
      } as productKeyboardArrayType
    ))

    productKeyboardArray = [
      ...productKeyboardArray,
      { type: 'separator' },
      ...row
    ]

  }

  productKeyboardArray = [
    ...productKeyboardArray,
    { type: 'separator' },
    { type: 'callback', key: 'back', label: 'Назад' }
  ]

  console.log(11111111, productKeyboardArray)
  return productKeyboardArray;
}

export const scenesConfig = {
  start: {
    text: 'старт',
    image: 'https://cs6.pikabu.ru/post_img/big/2015/06/08/3/1433735650_472905306.jpg',
    keyboard: [
      { type: 'callback', key: 'choiceProduct', label: 'Button 1' },
      { type: 'separator' },
      { type: 'url', url: 'https://t.me/charm_support', label: 'Поддержка' }
    ]
  },

  choiceProduct: {
    text: 'choiceProduct',
    image: 'https://cs6.pikabu.ru/post_img/big/2015/06/08/3/1433735650_472905306.jpg',
    keyboard: productKeyboard()
  },
} as const satisfies Record<string, scenesConfig>;

export type SceneName = keyof typeof scenesConfig;
