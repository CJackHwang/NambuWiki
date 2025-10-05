import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'NambuWiki',
  description: 'NambuWiki 文档与设定集',
  cleanUrls: true,
  lastUpdated: true,
  // 使用旧 VuePress 公共资源目录，保持 /images/* 路径兼容
  vite: {
    // 直接复用原 VuePress 静态资源目录（相对于 docs 根）
    publicDir: '.vuepress/public'
  },
  themeConfig: {
    logo: '/images/ic_nambu_docs.png',
    outline: [2, 4],
    search: {
      provider: 'local'
    },
    footer: {
      message: 'NambuWiki 文档与设定集',
      copyright: '© NambuWiki Contributors'
    },
    socialLinks: [],
    nav: [
      { text: '首页', link: '/' },
      { text: '历史 History', link: '/history/' },
      { text: '百科 Wiki', link: '/wiki/' },
      { text: '记忆 Memory', link: '/memory/' },
      { text: '新闻 News', link: '/news/' },
      { text: '小说 Novels', link: '/novels/' }
    ],
    sidebar: {
      '/history/': [
        { text: '总览', link: '/history/' },
        {
          text: '专题与时代',
          items: [
            { text: '九九建制特别专题', link: '/history/99_revolution' },
            { text: '南武集团', link: '/history/nambu_group' },
            { text: '香淳主义', link: '/history/kojunism' },
            { text: '现代史', link: '/history/modern' },
            { text: '古代史', link: '/history/ancient' },
            { text: '战争', link: '/history/war' },
            { text: '政党', link: '/history/party' },
            { text: '特别行政区', link: '/history/special_zone' },
            { text: '革命', link: '/history/revolution' }
          ]
        }
      ],
      '/wiki/': [
        { text: '总览', link: '/wiki/' },
        {
          text: '纲要 GRAND',
          items: [
            { text: '联合主义南武共和国', link: '/wiki/grand/unionist_nambu_republic' },
            { text: '南武集团', link: '/wiki/grand/nambu_group' },
            { text: '集团领导法', link: '/wiki/grand/law_of_group_leadership' },
            { text: '集团领导', link: '/wiki/grand/group_leadership' },
            { text: '中央政府', link: '/wiki/grand/central_government' },
            { text: '中央领导', link: '/wiki/grand/central_leadership' },
            { text: '联合所有制', link: '/wiki/grand/united_ownership' },
            { text: '南武大会', link: '/wiki/grand/nambu_congress' },
            { text: '南武联合主义党', link: '/wiki/grand/nambu_unionist_party' },
            { text: '南武联合主义军', link: '/wiki/grand/nambu_unionist_army' },
            { text: '人民革命阵线', link: '/wiki/grand/nambu_peoples_revolutionary_front' }
          ]
        },
        {
          text: '人物 PEOPLE',
          items: [
            { text: '南武香淳', link: '/wiki/people/nambu_kojun' },
            { text: '日向秋平', link: '/wiki/people/hinata_akira' },
            { text: '山本碧羽', link: '/wiki/people/yamamoto_hakuha' },
            { text: '林冬', link: '/wiki/people/hayashi_fuyu' },
            { text: '久崎文国', link: '/wiki/people/hisazaki_fumikuni' },
            { text: '砥匠纪和', link: '/wiki/people/togishi_norikazu' },
            { text: '川井八三', link: '/wiki/people/kawaii_hachimi' }
          ]
        },
        {
          text: '其他 OTHERS',
          items: [
            { text: '伟大南武帝国', link: '/wiki/others/great_nambu_empire' },
            { text: '南武共和国', link: '/wiki/others/nambu_republic' },
            { text: '联合主义南武党', link: '/wiki/others/nambu_democratic_republican_party' },
            { text: '香淳主义', link: '/wiki/others/kojunism' },
            { text: '开日委员会', link: '/wiki/others/kaijitsu_committee' },
            { text: '本部都', link: '/wiki/others/honbu_metropolis' },
            { text: '系光', link: '/wiki/others/keikou' },
            { text: '南武特区', link: '/wiki/others/nambu_special_zone' },
            { text: '南武联合主义集团', link: '/wiki/others/takezuka_group' },
            { text: 'Takezuka 国', link: '/wiki/others/takezuka_koku' },
            { text: '南武之歌', link: '/wiki/others/song_of_nambu' }
          ]
        }
      ],
      '/memory/': [
        { text: '总览', link: '/memory/' },
        {
          text: '制度与文档',
          items: [
            { text: '宪法', link: '/memory/constitution' },
            { text: '党章', link: '/memory/party_constitution' },
            { text: '南武设计', link: '/memory/nambu_design' },
            { text: '集团领导法', link: '/memory/group_leadership_law' },
            { text: '特别行政区法', link: '/memory/special_zone_law' },
            { text: '推进计划经济建设', link: '/memory/further_promoting_construction_of_planned_economy' },
            { text: '改革 Kaijitsu 领导体制', link: '/memory/reform_of_group_leadership_system_in_kaijitsu' }
          ]
        }
      ],
      '/news/': [
        { text: '总览', link: '/news/' },
        {
          text: '新闻',
          items: [
            { text: '抗战七十七周年纪念', link: '/news/77th_anniversary_of_nambu_defense_war' },
            { text: '香淳与二军政委会晤', link: '/news/kojun_meeting_with_second_army_political_commissar' }
          ]
        }
      ],
      '/novels/': [
        { text: '总览', link: '/novels/' },
        {
          text: '南武朋克 Nambu Punk',
          items: [
            { text: '第一章', link: '/novels/nambu_punk/1' },
            { text: '第二章', link: '/novels/nambu_punk/2' },
            { text: '第三章', link: '/novels/nambu_punk/3' }
          ]
        }
      ]
    }
  }
})
