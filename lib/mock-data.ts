// ==============================
// Aeconn Mock Data — 全量演示数据
// ==============================

export interface Contact {
  id: string
  name: string
  phone: string
  email: string
  lang: "zh" | "en"
  tags: string[]
  emailOptIn: boolean
  smsOptIn: boolean
  lastVisitAt: string
  createdAt: string
  visitCount: number
}

export interface Visit {
  id: string
  contactId: string
  contactName: string
  checkedInAt: string
  kioskId: string
  source: "kiosk" | "web" | "manual"
  status: "completed" | "pending" | "cancelled"
}

export interface Campaign {
  id: string
  name: string
  subject: string
  audienceCount: number
  status: "draft" | "sending" | "sent" | "failed"
  createdAt: string
  sentAt?: string
  openRate?: number
  clickRate?: number
}

export interface CampaignMessage {
  id: string
  campaignId: string
  recipient: string
  recipientName: string
  status: "delivered" | "opened" | "clicked" | "bounced" | "failed"
  failReason?: string
  sentAt: string
}

export interface DashboardMetrics {
  todayCheckins: number
  todayCheckinsDelta: number
  totalContacts: number
  totalContactsDelta: number
  consentRate: number
  consentRateDelta: number
  avgCheckinTime: string
  weeklyTrend: { day: string; checkins: number; newContacts: number }[]
  monthlyTrend: { date: string; checkins: number }[]
  topTags: { tag: string; count: number }[]
  hourlyDistribution: { hour: string; count: number }[]
}

// Helper
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

const cnNames = [
  "张伟", "王芳", "李明", "赵丽", "刘洋", "陈静", "杨磊", "黄晓雯",
  "周杰", "吴婷", "徐浩", "孙燕", "马超", "朱丹", "胡军", "郭雪",
  "林峰", "何冰", "高洁", "罗勇", "梁宇", "宋佳", "郑凯", "谢敏",
  "韩冰", "唐晶", "冯诚", "董薇", "程亮", "曹颖", "袁志", "邓莉",
  "许刚", "傅琳", "沈浩", "曾瑜", "彭鹏", "吕芳", "苏明", "卢洁",
  "蒋涛", "蔡欣", "贾磊", "丁晓", "魏华", "薛丽", "叶强", "阎敏",
  "余波", "潘悦", "杜鹃", "戴铭", "夏天", "钟意", "汪洋", "田甜",
  "任远", "姜辉", "范蕊", "方芳", "石坚", "姚瑶", "谭亮", "廖慧"
]

const enNames = [
  "Alex Chen", "Emily Wang", "Michael Li", "Sarah Zhang", "David Liu",
  "Jennifer Yang", "Kevin Wu", "Michelle Lin", "Jason Xu", "Angela Sun",
  "Brian Ma", "Catherine Zhu", "Daniel Hu", "Eva Guo", "Frank Zhou",
  "Grace He", "Henry Gao", "Iris Luo", "Jack Song", "Karen Zheng",
  "Leo Tang", "Mia Feng", "Nathan Dong", "Olivia Cheng", "Patrick Cao",
  "Quinn Yuan", "Ryan Deng", "Sophia Xu", "Thomas Fu", "Uma Shen",
  "Victor Peng", "Wendy Lv", "Xavier Su", "Yolanda Lu", "Zach Jiang",
  "Alice Cai", "Bob Jia", "Clara Ding", "Derek Wei", "Fiona Xue",
  "Gary Ye", "Helen Yan", "Ivan Yu", "Julia Pan", "Kyle Du",
  "Laura Dai", "Mark Xia", "Nina Zhong", "Oscar Wang", "Penny Tian",
  "Ray Ren", "Stella Fang", "Tom Shi", "Vivian Yao", "William Tan",
  "Zoe Liao"
]

const tagOptions = ["VIP", "新客户", "高意向", "设计咨询", "产品展示", "回访客", "合作伙伴", "媒体", "投资人", "展会客户"]

function generateContacts(): Contact[] {
  const contacts: Contact[] = []
  const allNames = [...cnNames, ...enNames]

  for (let i = 0; i < 120; i++) {
    const isZh = i < 64
    const name = allNames[i % allNames.length]
    const created = randomDate(new Date("2025-10-01"), new Date("2026-02-18"))
    const lastVisit = randomDate(created, new Date("2026-02-18"))
    const numTags = Math.floor(Math.random() * 3) + 1
    const tags: string[] = []
    for (let t = 0; t < numTags; t++) {
      const tag = tagOptions[Math.floor(Math.random() * tagOptions.length)]
      if (!tags.includes(tag)) tags.push(tag)
    }

    contacts.push({
      id: `C${String(i + 1).padStart(4, "0")}`,
      name,
      phone: isZh
        ? `138${String(Math.floor(Math.random() * 100000000)).padStart(8, "0")}`
        : `+1${String(Math.floor(Math.random() * 10000000000)).padStart(10, "0")}`,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}${i}@example.com`,
      lang: isZh ? "zh" : "en",
      tags,
      emailOptIn: Math.random() > 0.15,
      smsOptIn: Math.random() > 0.3,
      lastVisitAt: lastVisit.toISOString(),
      createdAt: created.toISOString(),
      visitCount: Math.floor(Math.random() * 8) + 1,
    })
  }

  return contacts.sort((a, b) => new Date(b.lastVisitAt).getTime() - new Date(a.lastVisitAt).getTime())
}

function generateVisits(contacts: Contact[]): Visit[] {
  const visits: Visit[] = []
  let vid = 1

  for (let i = 0; i < 280; i++) {
    const contact = contacts[Math.floor(Math.random() * contacts.length)]
    const checkedIn = randomDate(new Date("2026-01-18"), new Date("2026-02-18"))

    visits.push({
      id: `V${String(vid++).padStart(5, "0")}`,
      contactId: contact.id,
      contactName: contact.name,
      checkedInAt: checkedIn.toISOString(),
      kioskId: `KIOSK-${Math.floor(Math.random() * 3) + 1}`,
      source: ["kiosk", "kiosk", "kiosk", "web", "manual"][Math.floor(Math.random() * 5)] as Visit["source"],
      status: Math.random() > 0.05 ? "completed" : Math.random() > 0.5 ? "pending" : "cancelled",
    })
  }

  return visits.sort((a, b) => new Date(b.checkedInAt).getTime() - new Date(a.checkedInAt).getTime())
}

function generateCampaigns(): Campaign[] {
  return [
    { id: "CAM001", name: "春节回馈活动", subject: "新春快乐 | 专属优惠等您来", audienceCount: 86, status: "sent", createdAt: "2026-01-28T09:00:00Z", sentAt: "2026-01-28T10:30:00Z", openRate: 42.3, clickRate: 12.8 },
    { id: "CAM002", name: "新品发布邀请", subject: "Aeconn 2026 新品首发 | 邀请函", audienceCount: 120, status: "sent", createdAt: "2026-02-01T08:00:00Z", sentAt: "2026-02-01T09:15:00Z", openRate: 56.7, clickRate: 22.1 },
    { id: "CAM003", name: "VIP客户专享", subject: "尊享VIP | 限定体验日", audienceCount: 32, status: "sent", createdAt: "2026-02-05T10:00:00Z", sentAt: "2026-02-05T11:00:00Z", openRate: 68.5, clickRate: 35.4 },
    { id: "CAM004", name: "展会后续跟进", subject: "感谢莅临 | 展会资料回顾", audienceCount: 45, status: "sending", createdAt: "2026-02-15T14:00:00Z" },
    { id: "CAM005", name: "设计咨询服务推荐", subject: "专属设计方案 | 预约咨询", audienceCount: 58, status: "draft", createdAt: "2026-02-16T09:00:00Z" },
    { id: "CAM006", name: "二月新客欢迎", subject: "欢迎加入 Aeconn | 专享礼遇", audienceCount: 24, status: "draft", createdAt: "2026-02-17T11:00:00Z" },
    { id: "CAM007", name: "回访客户激活", subject: "好久不见 | 我们有新动态", audienceCount: 40, status: "failed", createdAt: "2026-02-10T08:00:00Z", sentAt: "2026-02-10T08:30:00Z", openRate: 0, clickRate: 0 },
    { id: "CAM008", name: "合作伙伴通讯", subject: "Aeconn 月度合作简报", audienceCount: 15, status: "sent", createdAt: "2026-02-12T10:00:00Z", sentAt: "2026-02-12T10:45:00Z", openRate: 73.3, clickRate: 40.0 },
  ]
}

function generateCampaignMessages(campaigns: Campaign[]): CampaignMessage[] {
  const messages: CampaignMessage[] = []
  let mid = 1
  const failReasons = ["邮箱不存在", "收件箱已满", "被标记为垃圾邮件", "域名DNS错误", "超时未响应"]

  for (const campaign of campaigns) {
    if (campaign.status === "draft") continue
    const count = Math.min(campaign.audienceCount, 150)
    for (let i = 0; i < count; i++) {
      const rand = Math.random()
      let status: CampaignMessage["status"] = "delivered"
      let failReason: string | undefined

      if (campaign.status === "failed") {
        status = "failed"
        failReason = failReasons[Math.floor(Math.random() * failReasons.length)]
      } else if (rand > 0.92) {
        status = "bounced"
        failReason = failReasons[Math.floor(Math.random() * failReasons.length)]
      } else if (rand > 0.85) {
        status = "failed"
        failReason = failReasons[Math.floor(Math.random() * failReasons.length)]
      } else if (rand > 0.55) {
        status = "opened"
      } else if (rand > 0.35) {
        status = "clicked"
      }

      messages.push({
        id: `MSG${String(mid++).padStart(5, "0")}`,
        campaignId: campaign.id,
        recipient: `user${mid}@example.com`,
        recipientName: cnNames[mid % cnNames.length],
        status,
        failReason,
        sentAt: campaign.sentAt || campaign.createdAt,
      })
    }
  }

  return messages
}

function getDashboardMetrics(visits: Visit[], contacts: Contact[]): DashboardMetrics {
  const today = new Date("2026-02-18")
  const todayStr = today.toISOString().split("T")[0]
  const todayVisits = visits.filter(v => v.checkedInAt.startsWith(todayStr))

  const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
  const weeklyTrend = days.map((day, i) => {
    const d = new Date("2026-02-12")
    d.setDate(d.getDate() + i)
    const ds = d.toISOString().split("T")[0]
    return {
      day,
      checkins: visits.filter(v => v.checkedInAt.startsWith(ds)).length + Math.floor(Math.random() * 15) + 5,
      newContacts: Math.floor(Math.random() * 8) + 2,
    }
  })

  const monthlyTrend: { date: string; checkins: number }[] = []
  for (let i = 30; i >= 0; i--) {
    const d = new Date("2026-02-18")
    d.setDate(d.getDate() - i)
    monthlyTrend.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      checkins: Math.floor(Math.random() * 18) + 4,
    })
  }

  const tagCounts: Record<string, number> = {}
  contacts.forEach(c => c.tags.forEach(t => { tagCounts[t] = (tagCounts[t] || 0) + 1 }))
  const topTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  const hourlyDistribution = Array.from({ length: 12 }, (_, i) => ({
    hour: `${i + 8}:00`,
    count: Math.floor(Math.random() * 20) + (i > 2 && i < 8 ? 10 : 2),
  }))

  const emailOptIns = contacts.filter(c => c.emailOptIn).length

  return {
    todayCheckins: todayVisits.length + 23,
    todayCheckinsDelta: 18.5,
    totalContacts: contacts.length,
    totalContactsDelta: 12.3,
    consentRate: Math.round((emailOptIns / contacts.length) * 100 * 10) / 10,
    consentRateDelta: 3.2,
    avgCheckinTime: "22s",
    weeklyTrend,
    monthlyTrend,
    topTags,
    hourlyDistribution,
  }
}

// Generate and export all mock data
export const mockContacts = generateContacts()
export const mockVisits = generateVisits(mockContacts)
export const mockCampaigns = generateCampaigns()
export const mockMessages = generateCampaignMessages(mockCampaigns)
export const mockDashboard = getDashboardMetrics(mockVisits, mockContacts)
