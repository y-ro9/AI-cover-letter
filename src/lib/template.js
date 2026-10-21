export function buildTemplateLetter({ name, role, company, skills }) {
  const list = (skills || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  let skillsText = 'modern development tools and best practices';
  if (list.length === 1) skillsText = list[0];
  if (list.length > 1) {
    skillsText = `${list.slice(0, -1).join(', ')} and ${list[list.length - 1]}`;
  }

  const date = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return `${date}

Dear Hiring Manager at ${company},

I am ${name}, and I am writing to express my strong interest in the ${role} position at ${company}. With hands-on experience in ${skillsText}, I am confident in my ability to contribute meaningfully to your team from day one.

Throughout my work, I have focused on turning requirements into reliable, user-facing solutions. My background in ${skillsText} has taught me how to write clean, maintainable code, collaborate closely with cross-functional teams, and deliver results on schedule. I enjoy breaking down complex problems into simple, practical steps that move the product forward.

${company} stands out to me because of its focus on quality engineering and its ambitious roadmap. I would love to bring my ${skillsText} expertise to that mission — contributing to the team while continuing to grow alongside talented engineers.

I would welcome the opportunity to discuss how my experience aligns with your goals. Thank you for your time and consideration.

Sincerely,
${name}`;
}
