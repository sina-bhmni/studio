import "./load-env"; // باید همیشه اولین import باشد
import { db } from "./index";
import {
  teamMembers,
  skills,
  memberSkills,
  socialLinks,
  experiences,
  educations,
  certifications,
  projects,
  projectMembers,
  services,
  testimonials,
  contactRequests,
} from "./schema";

async function seed() {
  console.log("🌱 پاک‌سازی دیتابیس...");
  await db.delete(memberSkills);
  await db.delete(projectMembers);
  await db.delete(socialLinks);
  await db.delete(experiences);
  await db.delete(educations);
  await db.delete(certifications);
  await db.delete(skills);
  await db.delete(projects);
  await db.delete(teamMembers);
  await db.delete(services);
  await db.delete(testimonials);
  await db.delete(contactRequests);

  /* ------------------------------ Team Members ----------------------------- */
  console.log("👥 ایجاد اعضای تیم...");
  const [sina, negar, arman, maryam] = await db
    .insert(teamMembers)
    .values([
      {
        name: "سینا محمدی",
        slug: "sina-mohammadi",
        role: "توسعه‌دهنده بک‌اند و متخصص امنیت شبکه",
        roleGroup: "developer",
        avatar: "/images/team/sina.jpg",
        bioShort:
          "معمار زیرساخت‌های امن؛ کسی که سرورها را مثل قلب تپنده‌ی پروژه مدیریت می‌کند.",
        bioFull:
          "سینا بیش از ۷ سال است که در حوزه‌ی توسعه‌ی بک‌اند و امنیت شبکه فعالیت می‌کند. او معماری سرویس‌های مقیاس‌پذیر، طراحی دیتابیس و hardened کردن زیرساخت را به‌عنوان مأموریت اصلی خود می‌داند. دارای مدرک بین‌المللی CCNA از سیسکو و تجربه‌ی عملی در پیاده‌سازی فایروال، VPN و سیستم‌های مانیتورینگ است. در استودیو نوا، سینا مسئول تصمیم‌گیری‌های فنی سمت سرور، امنیت داده‌های مشتریان و اتوماسیون استقرار (CI/CD) است. به گونه‌ای به وضوح و پایداری کد ایمان دارد که هم‌تیمی‌ها به او لقب «نگهبان شبکه» داده‌اند.",
        email: "sina@nova.studio",
        location: "تهران، ایران",
        joinDate: "۱۳۹۸",
        availableForHire: true,
        order: 1,
      },
      {
        name: "نگار رضایی",
        slug: "negar-rezaei",
        role: "طراح ارشد رابط و تجربه کاربری",
        roleGroup: "designer",
        avatar: "/images/team/negar.jpg",
        bioShort:
          "روایت‌گرِ پیکسل‌ها؛ طراحی برای او یعنی ترجمه‌ی احساس به رابط کاربری.",
        bioFull:
          "نگار با نگاهی عمیق به روان‌شناسی کاربر و چشمی وسواس‌گونه به جزئیات، تجربه‌های دیجیتالی می‌سازد که هم زیبا هستند و هم بی‌نیاز از راهنما. ۶ سال تجربه در طراحی محصول، ساخت دیزاین‌سیستم‌های مقیاس‌پذیر و هدایت تست‌های کاربردپذیری دارد. او معتقد است طراحی خوب از شنیدن شروع می‌شود، نه از کشیدن. در نوا، نگار مسیر کشف محصول تا تحویل نهایی UI را هدایت می‌کند و پلی است بین رویاهای مشتری و دنیای قابل اجرای توسعه‌دهندگان.",
        email: "negar@nova.studio",
        location: "تهران، ایران",
        joinDate: "۱۳۹۹",
        availableForHire: false,
        order: 2,
      },
      {
        name: "آرمان کاوه",
        slug: "arman-kaveh",
        role: "توسعه‌دهنده ارشد فرانت‌اند",
        roleGroup: "developer",
        avatar: "/images/team/arman.jpg",
        bioShort:
          "جادوگر مرورگر؛ هر طراحیِ غیرممکن را به کدی زنده و روان تبدیل می‌کند.",
        bioFull:
          "آرمان عاشق نقطه‌ی تلاقی کد و هنر است. تخصص او ساخت رابط‌های تعاملی با عملکرد بالا، انیمیشن‌های فیزیک‌محور و وب‌سایت‌هایی است که در مرورگر نفس می‌کشند. ۵ سال تجربه با اکوسیستم React و Next.js دارد و به بهینه‌سازی Core Web Vitals اعتقادی مذهبی دارد. او پشت اکثر موشن‌های باکلاس پروژه‌های نوا ایستاده و باور دارد که ۶۰ فریم‌برثانیه، یک استاندارد است نه یک آرزو.",
        email: "arman@nova.studio",
        location: "اصفهان، ایران",
        joinDate: "۱۴۰۰",
        availableForHire: true,
        order: 3,
      },
      {
        name: "مریم احمدی",
        slug: "maryam-ahmadi",
        role: "مدیر پروژه و استراتژیست محتوا",
        roleGroup: "manager",
        avatar: "/images/team/maryam.jpg",
        bioShort:
          "چسبِ تیم؛ کسی که پروژه‌ها را با کلمات و تقویم به خط پایان می‌رساند.",
        bioFull:
          "مریم با ۸ سال تجربه در مدیریت پروژه‌های دیجیتال و استراتژی محتوا، مغزِ متفکرِ نظم در استودیو نوا است. او چارچوب‌های چابک (Scrum/Kanban) را نه به‌عنوان آیین‌نامه، بلکه به‌عنوان ابزاری برای آرامش تیم به کار می‌برد. از سوی دیگر، قلمِ توانای او در کپی‌رایتینگ و تولید استراتژی محتوای فارسی، باعث شده بسیاری از مشتریان نوا تنها برای لحن و روایت برندشان سراغ ما بیایند. مریم پل ارتباطی میان مشتری، تیم و زمان‌بندی است.",
        email: "maryam@nova.studio",
        location: "شیراز، ایران",
        joinDate: "۱۳۹۷",
        availableForHire: false,
        order: 4,
      },
    ])
    .returning();

  /* --------------------------------- Skills -------------------------------- */
  console.log("⚡ ایجاد مهارت‌ها...");
  const skillRows = await db
    .insert(skills)
    .values([
      { name: "Python / Django", category: "backend" },
      { name: "PostgreSQL", category: "backend" },
      { name: "امنیت شبکه", category: "security" },
      { name: "Docker / DevOps", category: "security" },
      { name: "لینوکس", category: "security" },
      { name: "Figma", category: "design" },
      { name: "طراحی رابط کاربری", category: "design" },
      { name: "دیزاین سیستم", category: "design" },
      { name: "طراحی موشن", category: "design" },
      { name: "تحقیق کاربر (UX Research)", category: "design" },
      { name: "React", category: "frontend" },
      { name: "TypeScript", category: "frontend" },
      { name: "Next.js", category: "frontend" },
      { name: "انیمیشن (GSAP / Framer)", category: "frontend" },
      { name: "Tailwind CSS", category: "frontend" },
      { name: "مدیریت پروژه چابک", category: "management" },
      { name: "کپی‌رایتینگ", category: "management" },
      { name: "استراتژی محتوا", category: "management" },
      { name: "سئو", category: "management" },
      { name: "Scrum", category: "management" },
    ])
    .returning();

  const skillByName = new Map(skillRows.map((s) => [s.name, s.id]));
  const attach = async (memberId: number, list: [string, number][]) => {
    await db.insert(memberSkills).values(
      list.map(([name, proficiency]) => ({
        memberId,
        skillId: skillByName.get(name)!,
        proficiency,
      })),
    );
  };

  await attach(sina.id, [
    ["Python / Django", 92],
    ["PostgreSQL", 88],
    ["امنیت شبکه", 93],
    ["Docker / DevOps", 85],
    ["لینوکس", 90],
  ]);
  await attach(negar.id, [
    ["Figma", 95],
    ["طراحی رابط کاربری", 93],
    ["دیزاین سیستم", 88],
    ["طراحی موشن", 80],
    ["تحقیق کاربر (UX Research)", 85],
  ]);
  await attach(arman.id, [
    ["React", 94],
    ["TypeScript", 90],
    ["Next.js", 92],
    ["انیمیشن (GSAP / Framer)", 85],
    ["Tailwind CSS", 94],
  ]);
  await attach(maryam.id, [
    ["مدیریت پروژه چابک", 93],
    ["کپی‌رایتینگ", 95],
    ["استراتژی محتوا", 90],
    ["سئو", 80],
    ["Scrum", 88],
  ]);

  /* ------------------------------ Social Links ----------------------------- */
  await db.insert(socialLinks).values([
    { memberId: sina.id, platform: "github", url: "https://github.com/sina" },
    { memberId: sina.id, platform: "linkedin", url: "https://linkedin.com/in/sina" },
    { memberId: negar.id, platform: "dribbble", url: "https://dribbble.com/negar" },
    { memberId: negar.id, platform: "linkedin", url: "https://linkedin.com/in/negar" },
    { memberId: arman.id, platform: "github", url: "https://github.com/arman" },
    { memberId: arman.id, platform: "twitter", url: "https://x.com/arman" },
    { memberId: maryam.id, platform: "linkedin", url: "https://linkedin.com/in/maryam" },
    { memberId: maryam.id, platform: "instagram", url: "https://instagram.com/maryam" },
  ]);

  /* ------------------------------- Experiences ------------------------------ */
  await db.insert(experiences).values([
    { memberId: sina.id, title: "مهندس ارشد بک‌اند و DevOps", company: "استودیو نوا", startYear: "۱۴۰۱", endYear: null, description: "طراحی معماری میکروسرویس، پیاده‌سازی پایپ‌لاین CI/CD و مسئولیت امنیت کلی زیرساخت استودیو.", order: 1 },
    { memberId: sina.id, title: "متخصص امنیت شبکه", company: "شرکت داده‌پردازان آریا", startYear: "۱۳۹۹", endYear: "۱۴۰۱", description: "پیاده‌سازی فایروال لایه‌ی کاربرد، راه‌اندازی VPN سازمانی و انجام تست نفوذ داخلی.", order: 2 },
    { memberId: sina.id, title: "توسعه‌دهنده Django", company: "فروشگاه اینترنتی تخفیفان", startYear: "۱۳۹۷", endYear: "۱۳۹۹", description: "توسعه‌ی سیستم سفارش‌گیری و درگاه پرداخت با بیش از ۱۰ هزار تراکنش روزانه.", order: 3 },
    { memberId: negar.id, title: "طراح ارشد محصول", company: "استودیو نوا", startYear: "۱۴۰۰", endYear: null, description: "هدایت فرآیند کشف تا تحویل، ساخت دیزاین‌سیستم اختصاصی نوا و منتورینگ طراحان جونیور.", order: 1 },
    { memberId: negar.id, title: "طراح UI/UX", company: "دیجی‌استایل", startYear: "۱۳۹۸", endYear: "۱۴۰۰", description: "بازطراحی کامل تجربه‌ی خرید موبایل با افزایش ۲۳٪ نرخ تبدیل.", order: 2 },
    { memberId: negar.id, title: "طراح گرافیک", company: "آژانس تبلیغاتی رایکا", startYear: "۱۳۹۶", endYear: "۱۳۹۸", description: "طراحی هویت بصری و کمپین برای برندهای مصرفی.", order: 3 },
    { memberId: arman.id, title: "توسعه‌دهنده ارشد فرانت‌اند", company: "استودیو نوا", startYear: "۱۴۰۱", endYear: null, description: "توسعه رابط‌های تعاملی، رهبری فنی فرانت‌اند و بهینه‌سازی عملکرد تا سطح ۹۵+ لایت‌هاوس.", order: 1 },
    { memberId: arman.id, title: "توسعه‌دهنده React", company: "اسنپ‌فود", startYear: "۱۳۹۹", endYear: "۱۴۰۱", description: "توسعه‌ی پنل رستوران‌ها و سیستم پیگیری سفارش لحظه‌ای.", order: 2 },
    { memberId: arman.id, title: "توسعه‌دهنده وب (فریلنس)", company: "پروژه‌های مستقل", startYear: "۱۳۹۷", endYear: "۱۳۹۹", description: "پیاده‌سازی بیش از ۲۰ وب‌سایت شرکتی و فروشگاهی.", order: 3 },
    { memberId: maryam.id, title: "مدیر پروژه و استراتژیست محتوا", company: "استودیو نوا", startYear: "۱۴۰۲", endYear: null, description: "مدیریت هم‌زمان ۵ تا ۸ پروژه، ارتباط مستقیم با مشتریان و نظارت بر تقویم محتوایی برندها.", order: 1 },
    { memberId: maryam.id, title: "سرپرست تیم محتوا", company: "آژانس مخاطب", startYear: "۱۳۹۹", endYear: "۱۴۰۲", description: "مدیریت تیم ۶ نفره‌ی تولید محتوا و رشد ارگانیک ۳ برابری مشتریان.", order: 2 },
    { memberId: maryam.id, title: "کارشناس دیجیتال مارکتینگ", company: "همراه اول (پیمانکار)", startYear: "۱۳۹۶", endYear: "۱۳۹۹", description: "اجرای کمپین‌های دیجیتال و تحلیل داده‌های رفتار کاربر.", order: 3 },
  ]);

  /* -------------------------------- Education ------------------------------- */
  await db.insert(educations).values([
    { memberId: sina.id, degree: "کارشناسی مهندسی کامپیوتر", institution: "دانشگاه صنعتی امیرکبیر", startYear: "۱۳۹۳", endYear: "۱۳۹۷", order: 1 },
    { memberId: sina.id, degree: "کارشناسی ارشد امنیت شبکه", institution: "دانشگاه تهران", startYear: "۱۳۹۸", endYear: "۱۴۰۰", order: 2 },
    { memberId: negar.id, degree: "کارشناسی طراحی گرافیک", institution: "دانشگاه هنر تهران", startYear: "۱۳۹۲", endYear: "۱۳۹۶", order: 1 },
    { memberId: arman.id, degree: "کارشناسی مهندسی نرم‌افزار", institution: "دانشگاه اصفهان", startYear: "۱۳۹۴", endYear: "۱۳۹۸", order: 1 },
    { memberId: maryam.id, degree: "کارشناسی ارشد MBA", institution: "دانشگاه شیراز", startYear: "۱۳۹۵", endYear: "۱۳۹۸", order: 1 },
    { memberId: maryam.id, degree: "کارشناسی ادبیات فارسی", institution: "دانشگاه شیراز", startYear: "۱۳۹۱", endYear: "۱۳۹۵", order: 2 },
  ]);

  /* ----------------------------- Certifications ----------------------------- */
  await db.insert(certifications).values([
    { memberId: sina.id, title: "CCNA — Routing & Switching", issuer: "Cisco", year: "۱۴۰۰", order: 1 },
    { memberId: sina.id, title: "CEH — Certified Ethical Hacker", issuer: "EC-Council", year: "۱۴۰۱", order: 2 },
    { memberId: sina.id, title: "CKA — Kubernetes Administrator", issuer: "CNCF", year: "۱۴۰۲", order: 3 },
    { memberId: negar.id, title: "Google UX Design Certificate", issuer: "Google / Coursera", year: "۱۴۰۰", order: 1 },
    { memberId: negar.id, title: "Interaction Design Specialization", issuer: "UC San Diego", year: "۱۳۹۹", order: 2 },
    { memberId: arman.id, title: "Meta Front-End Developer", issuer: "Meta / Coursera", year: "۱۴۰۱", order: 1 },
    { memberId: arman.id, title: "Advanced TypeScript", issuer: "Total TypeScript", year: "۱۴۰۲", order: 2 },
    { memberId: maryam.id, title: "PSM I — Professional Scrum Master", issuer: "Scrum.org", year: "۱۴۰۱", order: 1 },
    { memberId: maryam.id, title: "Content Marketing Certification", issuer: "HubSpot", year: "۱۴۰۰", order: 2 },
  ]);

  /* --------------------------------- Projects ------------------------------- */
  console.log("🚀 ایجاد نمونه‌کارها...");
  const [kala, donya, safarkon, pars, rayan] = await db
    .insert(projects)
    .values([
      { title: "فروشگاه آنلاین «کالا»", slug: "kala-shop", description: "طراحی و توسعه‌ی کامل یک فروشگاه اینترنتی مد با تمرکز بر سرعت بارگذاری زیر یک ثانیه، سبد خرید هوشمند و پرداخت یک‌مرحله‌ای. نتیجه: رشد ۴۰٪ فروش در سه ماه‌ی اول.", thumbnail: "/images/projects/kala-shop.jpg", liveUrl: "https://example.com", clientName: "گروه بازرگانی کالا", category: "web", year: "۱۴۰۳", isFeatured: true, order: 1 },
      { title: "هویت بصری کافه «دنیا»", slug: "donya-cafe", description: "خلق برند از صفر: نام‌گذاری، لوگو، بسته‌بندی، منو و لحن ارتباطی. هویتی گرم و صمیمی که امروز در هر سه شعبه‌ی کافه نفس می‌کشد.", thumbnail: "/images/projects/donya-cafe.jpg", liveUrl: "https://example.com", clientName: "کافه دنیا", category: "branding", year: "۱۴۰۲", isFeatured: true, order: 2 },
      { title: "اپلیکیشن سفر «سفرکن»", slug: "safarkon", description: "طراحی تجربه و رابط کاربری اپلیکیشن برنامه‌ریزی سفر با نقشه‌ی تعاملی، برنامه‌ی سفر هوشمند و رزرو یکپارچه. امتیاز ۴٫۸ در کافه‌بازار.", thumbnail: "/images/projects/safarkon.jpg", liveUrl: "https://example.com", clientName: "استارتاپ سفرکن", category: "uiux", year: "۱۴۰۳", isFeatured: true, order: 3 },
      { title: "پورتال شرکتی «پارس‌انرژی»", slug: "pars-energy", description: "وب‌سایت شرکتی چندزبانه همراه با داشبورد تحلیلی مصرف انرژی، اتصال به APIهای داخلی و سطح امنیت سازمانی با احراز هویت دومرحله‌ای.", thumbnail: "/images/projects/pars-energy.jpg", liveUrl: "https://example.com", clientName: "هلدینگ پارس‌انرژی", category: "web", year: "۱۴۰۲", isFeatured: true, order: 4 },
      { title: "کمپین دیجیتال «رایان»", slug: "rayan-campaign", description: "استراتژی، کپی‌رایتینگ و اجرای کمپین ۹۰ روزه‌ی معرفی محصول با رشد ۱۲۰ هزار فالوئر ارگانیک و نرخ تعامل ۷٫۲٪ — دو برابر میانگین صنعت.", thumbnail: "/images/projects/rayan-campaign.jpg", liveUrl: "https://example.com", clientName: "نوشت‌افزار رایان", category: "marketing", year: "۱۴۰۱", isFeatured: false, order: 5 },
    ])
    .returning();

  await db.insert(projectMembers).values([
    { projectId: kala.id, memberId: sina.id, roleInProject: "معماری بک‌اند و درگاه پرداخت" },
    { projectId: kala.id, memberId: arman.id, roleInProject: "توسعه فرانت‌اند" },
    { projectId: kala.id, memberId: maryam.id, roleInProject: "مدیریت پروژه" },
    { projectId: donya.id, memberId: negar.id, roleInProject: "طراحی هویت بصری" },
    { projectId: donya.id, memberId: maryam.id, roleInProject: "استراتژی برند و نام‌گذاری" },
    { projectId: safarkon.id, memberId: negar.id, roleInProject: "تحقیق کاربر و طراحی تجربه" },
    { projectId: safarkon.id, memberId: arman.id, roleInProject: "نمونه‌سازی تعاملی" },
    { projectId: pars.id, memberId: sina.id, roleInProject: "امنیت و زیرساخت" },
    { projectId: pars.id, memberId: negar.id, roleInProject: "طراحی رابط داشبورد" },
    { projectId: pars.id, memberId: arman.id, roleInProject: "توسعه فرانت‌اند" },
    { projectId: rayan.id, memberId: maryam.id, roleInProject: "استراتژی و کپی‌رایتینگ" },
    { projectId: rayan.id, memberId: negar.id, roleInProject: "طراحی قالب‌های بصری" },
  ]);

  /* --------------------------------- Services -------------------------------- */
  await db.insert(services).values([
    { title: "طراحی رابط و تجربه کاربری", description: "از تحقیق کاربر تا دیزاین‌سیستم کامل؛ رابط‌هایی که کاربر بدون فکر کردن می‌فهمد.", icon: "pen-tool", order: 1 },
    { title: "توسعه وب و اپلیکیشن", description: "وب‌سایت‌ها و وب‌اپ‌های سریع، امن و مقیاس‌پذیر با جدیدترین تکنولوژی‌های روز.", icon: "code-2", order: 2 },
    { title: "برندینگ و هویت بصری", description: "نام، لوگو، لحن و سیستم بصری؛ برندی که در ذهن‌ها جا می‌گیرد و رشد می‌کند.", icon: "fingerprint", order: 3 },
    { title: "سئو و بازاریابی دیجیتال", description: "دیده‌شدن در گوگل و شبکه‌های اجتماعی با استراتژی داده‌محور، نه حدس و گمان.", icon: "trending-up", order: 4 },
    { title: "تولید محتوا", description: "کپی‌رایتینگ فارسی حرفه‌ای، تقویم محتوایی و روایت‌گری برند که مخاطب را دوست‌دار محصول می‌کند.", icon: "feather", order: 5 },
    { title: "امنیت و زیرساخت شبکه", description: "تست نفوذ، هاردنینگ سرور، راه‌اندازی VPN و مانیتورینگ — آسودگی خیال شما مأموریت ماست.", icon: "shield-check", order: 6 },
  ]);

  /* ------------------------------- Testimonials ------------------------------ */
  await db.insert(testimonials).values([
    { clientName: "بهنام کریمی", clientRole: "مدیرعامل گروه بازرگانی کالا", content: "تیم نوا فقط یک پیمانکار نبود، شریک واقعی ما بود. فروشگاه جدید ما سریع‌تر، زیباتر و پرفروش‌تر از چیزی شد که تصور می‌کردیم. انضباط مریم در مدیریت پروژه و دقت سینا در امنیت، ترکیبی کمیاب است.", rating: 5, order: 1 },
    { clientName: "درسا میرزایی", clientRole: "بنیان‌گذار کافه دنیا", content: "نگار برند ما را آن‌قدر خوب فهمید که طرح نهایی تقریباً همان پیش‌نویس اول بود! امروز مشتری‌ها برای عکس گرفتن با بسته‌بندی‌مان به کافه می‌آیند.", rating: 5, order: 2 },
    { clientName: "فرهاد توکلی", clientRole: "مدیر محصول استارتاپ سفرکن", content: "همکاری با نوا یعنی آرامش. ددلاین‌ها دقیق، ارتباطات شفاف و خروجی فراتر از انتظار. آرمان انیمیشن‌هایی ساخت که کاربرانمان هنوز درباره‌شان صحبت می‌کنند.", rating: 5, order: 3 },
    { clientName: "شیرین دانش", clientRole: "مدیر فناوری اطلاعات پارس‌انرژی", content: "در پروژه‌ی سازمانی ما امنیت حرف اول را می‌زد. سینا با دید مهندسی و مدارک تخصصی‌اش، زیرساختی تحویل داد که از تست نفوذ خارجی با افتخار بیرون آمد.", rating: 5, order: 4 },
  ]);

  /* --------------------------- Sample contact request ------------------------ */
  await db.insert(contactRequests).values([
    { name: "نمونه — شرکت آوات", email: "info@avat.example", phone: "۰۹۱۲۳۴۵۶۷۸۹", projectType: "طراحی وب‌سایت", budget: "۵۰ تا ۱۰۰ میلیون تومان", message: "سلام، برای بازطراحی وب‌سایت شرکتی‌مان به دنبال یک تیم حرفه‌ای هستیم. لطفاً برای جلسه‌ی اولیه هماهنگ کنید.", status: "pending" },
  ]);

  console.log("✅ Seed کامل شد!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ خطا در Seed:", err);
  process.exit(1);
});
