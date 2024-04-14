require('dotenv').config();
const { Bot, Keyboard, InlineKeyboard, GrammyError, HttpError, session } = require('grammy');
const { hydrate } = require('@grammyjs/hydrate')

const bot = new Bot(process.env.BOT_API_KEY);

bot.use(hydrate());
bot.use(session());
//Меню команд
bot.api.setMyCommands([
    {
        command: 'start',
        description: 'Запуск бота'
    },
    {
        command: 'menu',
        description: 'Главное меню'
    }
])

//Главное меню
bot.command(['start', 'menu'], async (ctx) => {
    const startKeyboard = new Keyboard()
        .text('Наши услуги')
        .text('Тарифы')
        .row()
        .text('Часто задаваемые вопросы')
        .text('Получить консультацию')
        .row()
        .resized();

    await ctx.reply('*Главное меню*',
        {
            reply_markup: startKeyboard,
            parse_mode: "MarkdownV2"
        });
})

//Клавиатуры 1 уровня
const servicesKeyboard = new InlineKeyboard()
    .text('Перевод денег', 'money_transfer')
    .row()
    .text('Подбор товаров', 'selection')
    .row()
    .text('Маркировка товара в честном знаке', 'marking_sign')
    .row()
    .text('Выкуп и дальнейшая отправка грузов', 'redemption_further')
    .row()
    .text('Оформление всех необходимых документов', 'registration')
    .row()
    .text('Международная и междугородняя перевозка грузов под ключ', 'international')

const rateKeyboard = new InlineKeyboard()
    .text('Логистика', 'logistics')
    .row()
    .text('Маркировка', 'marking')
    .row()

const frequentQuestionsKeyboard = new InlineKeyboard()
    .text('Откуда возможна доставка?', 'question1')
    .row()
    .text('Можно ли оплатить товар из России на российскую компанию?', 'question2')
    .row()
    .text('Можно ли отправить деньги зарубеж через нас?', 'question3')
    .row()
    .text('Есть ли у нас свои склады?', 'question4')
    .row()
    .text('Где наши офисы?', 'question5')
    .row()
    .text('Занимаемся ли мы подбором товара?', 'question6')

const getConsultKeyboard = new InlineKeyboard()
    .text('Вопрос по 1 теме', 'getConsult1')
    .row()
    .text('Вопрос по 2 теме', 'getConsult2')
    .row()
    .text('Вопрос по 3 теме', 'getConsult3')

//Реакции на кнопки главного меню
bot.hears(
    ['Наши услуги', 'Тарифы', 'Часто задаваемые вопросы', 'Получить консультацию'],
    async (ctx) => {
        switch (ctx.match) {
            case 'Наши услуги':
                await ctx.reply('Выберите интересующую вас услугу:', {
                    reply_markup: servicesKeyboard,
                });
                break;
            case 'Тарифы':
                await ctx.reply('Выберите интересующий вас тариф:', {
                    reply_markup: rateKeyboard,
                });
                break;
            case 'Часто задаваемые вопросы':
                await ctx.reply('Часто задаваемые вопросы', {
                    reply_markup: frequentQuestionsKeyboard,
                });
                break;
            case 'Получить консультацию':
                ctx.session = { state: 'waiting_question' };
                await ctx.reply('Введите ваш вопрос:');
                break;
            default:
                await ctx.reply('Выберите интересующую вас услугу:', {
                    reply_markup: servicesKeyboard,
                });
        }

    },
);

//Клава 2 уровня
const moneyTransfer = new InlineKeyboard()
    .text('Получить консультацию', 'consult')
    .text('◀️ Назад', 'back_servicesKeyboard');

const rate = new InlineKeyboard()
    .text('Получить консультацию', 'consult')
    .text('◀️ Назад', 'back_rateKeyboard');

const logistics = new InlineKeyboard()
    .text('Турция', 'Turkey')
    .text('Китай', 'China')
    .text('◀️ Назад', 'back_rateKeyboard');
const frequentQuestions = new InlineKeyboard()
    .text('Оставить заявку', 'consultQuestion')
    .text('◀️ Назад', 'back_frequentQuestionsKeyboard');
const getConsult = new InlineKeyboard()
    .text('Получить консультацию', 'consultQuestion')
    .text('◀️ Назад', 'back_frequentQuestionsKeyboard');


//Клава страна-тариф
const countryRateTurkey = new InlineKeyboard()
    .text('Получить консультацию', 'consultQuestion')
    .text('◀️ Назад', 'back_logistics');
const countryRateChina = new InlineKeyboard()
    .text('Получить консультацию', 'consultQuestion')
    .text('◀️ Назад', 'back_logistics');

//Реакция на 1 кнопку гл.меню
bot.callbackQuery(['money_transfer', 'selection', 'marking_sign', 'redemption_further', 'registration', 'international'], async (ctx) => {
    switch (ctx.callbackQuery.data) {
        case 'money_transfer':
            await ctx.callbackQuery.message.editText('Для получения информации по усуге "Перевод денег" вы можете связаться с нашим менеджером Рустамом по телефону +7-928-148-66-56 или просто нажмите кнопку "Получить консультацию"', {
                reply_markup: moneyTransfer
            })
            break;
        case 'selection':
            await ctx.callbackQuery.message.editText('Для получения более подробной информации вы можете связаться с нашим менеджером Руфатом по телефону +7-926-887-75-55 или просто нажмите кнопку "Получить консультацию"', {
                reply_markup: moneyTransfer
            })
            break;
        case 'marking_sign':
            await ctx.callbackQuery.message.editText('Для получения более подробной информации вы можете связаться с нашим менеджером Натальей по телефону +7-980-146-33-46 или просто нажмите кнопку "Получить консультацию"', {
                reply_markup: moneyTransfer
            })
            break;
        case 'redemption_further':
            await ctx.callbackQuery.message.editText('Для получения подробной информации по услуге: "Выкуп и дальнейшая отправка грузов" вы можете связаться с нашим руководителем Васифом по телефону +90-535-268-52-28 или просто нажмите кнопку "Получить консультацию"', {
                reply_markup: moneyTransfer
            })
            break;
        case 'registration':
            await ctx.callbackQuery.message.editText('Мы работаем по договору купли-продажи, поэтому предоставляем:\nДоговор Упд(накладную - о передаче товара\nДС\nДТ первые листы о том, что товар выпустился, и номером гтд, но без перечисления товара - но не всегда, по запросу клиента.\nДля получения более подробной информации вы можете связаться с нашим менеджером Натальей по телефону +7-980-146-33-46 или просто нажмите кнопку "Получить консультацию"', {
                reply_markup: moneyTransfer
            })
            break;
        case 'international':
            await ctx.callbackQuery.message.editText('Для получения подробной информации вы можете связаться с нашим менеджером Валерией по телефону +7-996-510-80-02, а также с руководителем Васифом по телефону +90-535-268-52-28 или просто нажмите кнопку "Получить консультацию"', {
                reply_markup: moneyTransfer
            })
            break;
        default:
            await ctx.callbackQuery.message.editText('Здесь будет информация о переводе денег', {
                reply_markup: moneyTransfer
            })
    }

    await ctx.answerCallbackQuery()
})

bot.callbackQuery('back_servicesKeyboard', async (ctx) => {
    await ctx.callbackQuery.message.editText('Выберите интересующую вас услугу:', {
        reply_markup: servicesKeyboard
    })
    await ctx.answerCallbackQuery()
})

//Реакция на 2 кнопку гл.меню
bot.callbackQuery(['logistics', 'marking'], async (ctx) => {
    switch (ctx.callbackQuery.data) {
        case 'logistics':
            await ctx.callbackQuery.message.editText('Выберите страну', {
                reply_markup: logistics
            })
            break;
        case 'marking':
            await ctx.callbackQuery.message.editText('Для получения информации о маркировке нажмите кнопку "Получить консультацию"', {
                reply_markup: rate
            })
            break;
        default:
            await ctx.callbackQuery.message.editText('Здесь будет информация о маркировке', {
                reply_markup: rate
            })
    }

    await ctx.answerCallbackQuery()
})

bot.callbackQuery('back_logistics', async (ctx) => {
    await ctx.callbackQuery.message.editText('Выберите интересующую вас услугу:', {
        reply_markup: logistics
    })
    await ctx.answerCallbackQuery()
})

bot.callbackQuery('back_rateKeyboard', async (ctx) => {
    await ctx.callbackQuery.message.editText('Выберите интересующую вас услугу:', {
        reply_markup: rateKeyboard
    })
    await ctx.answerCallbackQuery()
})

//Реакт на страну
bot.callbackQuery(['Turkey', 'China'], async (ctx) => {
    switch (ctx.callbackQuery.data) {
        case 'Turkey':
            await ctx.callbackQuery.message.editText('Чтобы получить информацию по тарифам Турции, свяжитесь с нами', {
                reply_markup: countryRateTurkey
            })
            break;
        case 'China':
            await ctx.callbackQuery.message.editText('Чтобы получить информацию по тарифам Китая, свяжитесь с нами', {
                reply_markup: countryRateChina
            })
            break;
        default:
            await ctx.callbackQuery.message.editText('Здесь будет информация о логистике', {
                reply_markup: logistics
            })
    }

    await ctx.answerCallbackQuery()
})

//Реакт на 3 кнопку гл.меню
bot.callbackQuery(['question1', 'question2', 'question3', 'question4', 'question5', 'question6'], async (ctx) => {
    switch (ctx.callbackQuery.data) {
        case 'question1':
            await ctx.callbackQuery.message.editText('Доставка возможно из любой точки мира. Оформим документы,привезем по указанному адресу.', {
                reply_markup: frequentQuestions
            })
            break;
        case 'question2':
            await ctx.callbackQuery.message.editText('Да,можно,если вам необходима такая услуга, оставьте заявку, мы с сразу с Вами свяжемся.', {
                reply_markup: frequentQuestions
            })
            break;
        case 'question3':
            await ctx.callbackQuery.message.editText('Конечно,можно! Для этого оставьте заявку и мы сразу с Вами свяжемся.', {
                reply_markup: frequentQuestions
            })
            break;
        case 'question4':
            await ctx.callbackQuery.message.editText('Есть! В Стамбуле, Пекине,Гуанчжоу и в Москве.', {
                reply_markup: frequentQuestions
            })
            break;
        case 'question5':
            await ctx.callbackQuery.message.editText('В Стамбуле, Пекине,Гуанчжоу и в Москве.', {
                reply_markup: frequentQuestions
            })
            break;
        case 'question6':
            await ctx.callbackQuery.message.editText('Да,можем помочь подобрать товар и нишу,привезти образцы и помочь вам с выходом на маркетплейсы.', {
                reply_markup: frequentQuestions
            })
            break;
        default:
            await ctx.callbackQuery.message.editText('Выберите вопрос:', {
                reply_markup: frequentQuestionsKeyboard
            })
    }

    await ctx.answerCallbackQuery()
})

bot.callbackQuery('back_frequentQuestionsKeyboard', async (ctx) => {
    await ctx.callbackQuery.message.editText('Выберите вопрос:', {
        reply_markup: frequentQuestionsKeyboard
    })
    await ctx.answerCallbackQuery()
})

bot.callbackQuery('consultQuestion', async (ctx) => {
    ctx.session = { state: 'waiting_question' };
    await ctx.callbackQuery.message.editText('Введите ваш вопрос:')
    await ctx.answerCallbackQuery()
})

bot.callbackQuery('consult', async (ctx) => {
    ctx.session = { state: 'waiting_question' };
    await ctx.callbackQuery.message.editText('Введите ваш вопрос:')
    await ctx.answerCallbackQuery()
})

//---------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------
bot.on('message:text', async (ctx) => {
    // Проверяем состояние сессии пользователя и обрабатываем текстовые сообщения в соответствии с ним
    if (ctx.session.state === 'waiting_question') {
        // Если пользователь ожидает ввода вопроса, сохраняем вопрос в сессии и переходим к ожиданию имени
        ctx.session.state = 'waiting_name';
        ctx.session.question = ctx.message.text;
        await ctx.reply('Теперь введите ваше имя:');
    } else if (ctx.session.state === 'waiting_name') {
        // Если пользователь ожидает ввода имени, сохраняем имя в сессии и переходим к ожиданию контакта
        ctx.session.state = 'waiting_contact';
        ctx.session.name = ctx.message.text;

        await ctx.reply('Отлично, отправьте ваш контакт, нажав на кнопку ниже:');
        await ctx.reply('Поделиться контактом', {
            reply_markup: {
                keyboard: [
                    [
                        { text: 'Поделиться контактом', request_contact: true }
                    ]
                ],
                resize_keyboard: true,
                one_time_keyboard: true
            }
        });
    }
});

bot.on('message:contact', async (ctx) => {
    if (ctx.session.state === 'waiting_contact') {

        const phone = ctx.message.contact.phone_number;
        const { question, name } = ctx.session;

        const message = `Получен новый вопрос:\n\nВопрос: ${question}\nИмя: ${name}\nТелефон: ${phone}`;

        await ctx.reply('Спасибо! Ваш вопрос и контакт успешно переданы.\nВ ближайшее время с вами свяжутся!');

        await ctx.api.sendMessage(350376775, message)
    }
})
//---------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
        console.error('Error in request:', e.description);
    } else if (e instanceof HttpError) {
        console.error('Could not contact Telegram:', e);
    } else {
        console.error('Unknown error:', e);
    }
});

bot.start()