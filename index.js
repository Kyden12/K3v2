const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder, ActivityType } = require('discord.js');

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

const orderList = [null, null, null, null, null];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ]
});

async function registerCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName('add')
      .setDescription('Add a user to the K3 Order List')
      .addUserOption(option =>
        option.setName('user')
          .setDescription('The user to add')
          .setRequired(true)
      ),
    new SlashCommandBuilder()
      .setName('remove')
      .setDescription('Remove a user from the K3 Order List')
      .addUserOption(option =>
        option.setName('user')
          .setDescription('The user to remove')
          .setRequired(true)
      ),
    new SlashCommandBuilder()
      .setName('list')
      .setDescription('View the current K3 Order List'),
    new SlashCommandBuilder()
      .setName('clear')
      .setDescription('Clear the entire K3 Order List'),
  ].map(cmd => cmd.toJSON());

  const rest = new REST({ version: '10' }).setToken(TOKEN);

  try {
    console.log('Registering slash commands...');
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log('Slash commands registered successfully!');
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
}

function buildListEmbed(highlightSlot = null) {
  const embed = new EmbedBuilder()
    .setTitle('📋 K3 Order List')
    .setColor(0x5865F2)
    .setTimestamp();

  let description = '';
  for (let i = 0; i < 5; i++) {
    const slot = i + 1;
    const user = orderList[i];
    const isHighlighted = highlightSlot === slot;
    const userDisplay = user ? `<@${user.id}>` : '*(empty)*';
    if (isHighlighted) {
      description += `**${slot}. ${userDisplay} ← added**\n`;
    } else {
      description += `${slot}. ${userDisplay}\n`;
    }
  }

  embed.setDescription(description);
  return embed;
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'add') {
    const user = interaction.options.getUser('user');

    const alreadyIn = orderList.findIndex(u => u && u.id === user.id);
    if (alreadyIn !== -1) {
      return interaction.reply({
        content: `<@${user.id}> is already in slot **${alreadyIn + 1}** of the K3 Order List.`,
        ephemeral: true
      });
    }

    const openSlot = orderList.findIndex(u => u === null);
    if (openSlot === -1) {
      return interaction.reply({
        content: '❌ The K3 Order List is full! Remove someone first.',
        ephemeral: true
      });
    }

    orderList[openSlot] = { id: user.id, username: user.username };

    const embed = buildListEmbed(openSlot + 1);
    await interaction.reply({
      content: `✅ <@${user.id}> has been added to slot **${openSlot + 1}**!`,
      embeds: [embed]
    });
  }

  else if (commandName === 'remove') {
    const user = interaction.options.getUser('user');
    const slotIndex = orderList.findIndex(u => u && u.id === user.id);

    if (slotIndex === -1) {
      return interaction.reply({
        content: `<@${user.id}> is not in the K3 Order List.`,
        ephemeral: true
      });
    }

    orderList[slotIndex] = null;
    const embed = buildListEmbed();
    await interaction.reply({
      content: `🗑️ <@${user.id}> has been removed from slot **${slotIndex + 1}**.`,
      embeds: [embed]
    });
  }

  else if (commandName === 'list') {
    const embed = buildListEmbed();
    await interaction.reply({ embeds: [embed] });
  }

  else if (commandName === 'clear') {
    for (let i = 0; i < 5; i++) orderList[i] = null;
    const embed = buildListEmbed();
    await interaction.reply({
      content: '🧹 The K3 Order List has been cleared.',
      embeds: [embed]
    });
  }
});

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: 'K3 Order List', type: ActivityType.Watching }],
    status: 'online',
  });
});

registerCommands().then(() => client.login(TOKEN));
