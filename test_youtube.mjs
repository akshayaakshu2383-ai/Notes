import { YoutubeTranscript } from 'youtube-transcript';
// If the above fails, try: import YoutubeTranscript from 'youtube-transcript';

const url = 'https://www.youtube.com/watch?v=eIho2S0ZahI';

YoutubeTranscript.fetchTranscript(url)
  .then(transcript => {
    console.log('Transcript fetched successfully! First 100 chars:');
    console.log(transcript.map(t => t.text).join(' ').substring(0, 100));
  })
  .catch(err => {
    console.error('Error fetching transcript:', err.message);
  });
