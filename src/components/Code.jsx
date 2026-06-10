import React from 'react'

function CodeBlock({ filename, lang, children }) {
  return (
    <div className="code-showcase fade-in">
      <div className="code-header">
        <div className="code-dots">
          <span className="r" /><span className="y" /><span className="g" />
        </div>
        <span className="code-filename">{filename}</span>
        <span className="code-lang">{lang}</span>
      </div>
      <pre dangerouslySetInnerHTML={{ __html: children }} />
    </div>
  )
}

const BUBBLE_SORT = `<span class="cmt">// Enhanced Bubble Sort with early-exit optimisation (O(n) best case)</span>
<span class="kw">public class</span> <span class="type">EnhancedBubbleSort</span> {
  <span class="kw">public static int</span>[] <span class="fn">enhancedBubbleSort</span>(<span class="kw">int</span>[] arr) {
    <span class="kw">int</span> n = arr.length, totalSwaps = <span class="num">0</span>, passes = <span class="num">0</span>;
    <span class="kw">for</span> (<span class="kw">int</span> i = <span class="num">0</span>; i &lt; n - <span class="num">1</span>; i++) {
      <span class="kw">boolean</span> swapped = <span class="kw">false</span>; passes++;
      <span class="kw">for</span> (<span class="kw">int</span> j = <span class="num">0</span>; j &lt; n - <span class="num">1</span> - i; j++) {
        <span class="kw">if</span> (arr[j] &gt; arr[j + <span class="num">1</span>]) {
          <span class="kw">int</span> tmp = arr[j]; arr[j] = arr[j+<span class="num">1</span>]; arr[j+<span class="num">1</span>] = tmp;
          swapped = <span class="kw">true</span>; totalSwaps++;
        }
      }
      <span class="kw">if</span> (!swapped) <span class="kw">break</span>; <span class="cmt">// Early-exit: array already sorted</span>
    }
    <span class="type">System</span>.out.<span class="fn">printf</span>(<span class="str">"Passes: %d | Swaps: %d%n"</span>, passes, totalSwaps);
    <span class="kw">return</span> arr;
  }
}`

const MOCK_DB = `<span class="cmt">// Thread-safe in-memory DB using AtomicInteger for ID sequencing</span>
<span class="kw">public class</span> <span class="type">MockDbConnection</span> {
  <span class="kw">private final</span> <span class="type">Map</span>&lt;<span class="type">Integer</span>, <span class="type">Registrant</span>&gt; registrants = <span class="kw">new</span> <span class="fn">HashMap</span>&lt;&gt;();
  <span class="kw">private final</span> <span class="type">AtomicInteger</span> idSeq = <span class="kw">new</span> <span class="fn">AtomicInteger</span>(<span class="num">1</span>);

  <span class="kw">public</span> <span class="type">Registrant</span> <span class="fn">findByIdNumber</span>(<span class="type">String</span> idNumber, <span class="type">String</span> companyId) {
    <span class="kw">return</span> registrants.<span class="fn">values</span>().<span class="fn">stream</span>()
      .<span class="fn">filter</span>(r -&gt; r.<span class="fn">getIdNumber</span>().<span class="fn">equalsIgnoreCase</span>(idNumber) &amp;&amp; r.<span class="fn">getCompanyId</span>().<span class="fn">equals</span>(companyId))
      .<span class="fn">findFirst</span>().<span class="fn">orElse</span>(<span class="kw">null</span>);
  }
  <span class="kw">public void</span> <span class="fn">recordCheckIn</span>(<span class="kw">int</span> regId) <span class="kw">throws</span> <span class="type">SQLException</span> {
    <span class="type">Registrant</span> r = registrants.<span class="fn">get</span>(regId);
    <span class="kw">if</span> (r == <span class="kw">null</span>) <span class="kw">throw new</span> <span class="type">SQLException</span>(<span class="str">"Registrant not found"</span>);
    r.<span class="fn">checkIn</span>();
    visitLogs.<span class="fn">get</span>(regId).<span class="fn">add</span>(<span class="str">"Check-in: "</span> + java.time.<span class="type">LocalDateTime</span>.<span class="fn">now</span>());
  }
}`

const EVENTS_JS = `<span class="cmt">// Fan-out notifications to all followers on event creation</span>
<span class="kw">export const</span> <span class="fn">createEvent</span> = <span class="kw">async</span> (eventData, user) =&gt; {
  <span class="kw">const</span> newEventRef = <span class="fn">push</span>(<span class="fn">ref</span>(db, <span class="str">'events'</span>));
  <span class="kw">await</span> <span class="fn">set</span>(newEventRef, { ...eventData, hostId: user.uid, createdAt: <span class="kw">new</span> <span class="type">Date</span>().<span class="fn">toISOString</span>() });
  <span class="kw">const</span> followersSnap = <span class="kw">await</span> <span class="fn">get</span>(<span class="fn">ref</span>(db, <span class="str">'follows'</span>));
  <span class="kw">if</span> (followersSnap.<span class="fn">exists</span>()) {
    <span class="kw">const</span> notifications = [];
    followersSnap.<span class="fn">forEach</span>(userSnap =&gt; {
      <span class="kw">if</span> (userSnap.<span class="fn">child</span>(user.uid).<span class="fn">exists</span>())
        notifications.<span class="fn">push</span>(<span class="fn">createNotification</span>(userSnap.key, { type: <span class="str">'reminder'</span>, eventId: newEventRef.key }));
    });
    <span class="kw">await</span> <span class="type">Promise</span>.<span class="fn">all</span>(notifications); <span class="cmt">// parallel fan-out</span>
  }
  <span class="kw">return</span> newEventRef.key;
};`

export default function Code() {
  return (
    <section id="code" style={{ maxWidth: '1200px', margin: '0 auto', padding: '6rem 3rem' }}>
      <div className="section-header fade-in">
        <span className="section-num">02</span>
        <h2>Code <em>Samples</em></h2>
        <div className="section-line" />
      </div>
      <CodeBlock filename="EnhancedBubbleSort.java, DSA Lab" lang="Java · Data Structures">
        {BUBBLE_SORT}
      </CodeBlock>
      <CodeBlock filename="MockDbConnection.java, Smart Entry System" lang="Java">
        {MOCK_DB}
      </CodeBlock>
      <CodeBlock filename="events.js, Group Delta Event Ecosystem" lang="JavaScript / Firebase">
        {EVENTS_JS}
      </CodeBlock>
    </section>
  )
}
