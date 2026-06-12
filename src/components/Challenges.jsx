const challenges = [
  {
    title: 'No Car Week',
    description: 'Choose public transit, biking, or walking to reduce vehicle emissions for seven days.'
  },
  {
    title: 'Zero Plastic Challenge',
    description: 'Avoid single-use plastics and switch to reusable containers, bags, and bottles.'
  },
  {
    title: 'Tree Plantation Drive',
    description: 'Plant native trees or support a local green initiative to offset carbon emissions.'
  }
];

function Challenges() {
  return (
    <section className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl shadow-slate-950/25">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-emerald-300">Challenges</h2>
          <p className="text-sm text-slate-400">Engage with sustainable goals designed to improve your carbon footprint.</p>
        </div>
        <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-200">Weekly goals</span>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {challenges.map((challenge) => (
          <article key={challenge.title} className="rounded-3xl border border-slate-800 bg-slate-950/80 p-5">
            <h3 className="mb-3 text-lg font-semibold text-slate-100">{challenge.title}</h3>
            <p className="text-sm leading-6 text-slate-400">{challenge.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Challenges;
