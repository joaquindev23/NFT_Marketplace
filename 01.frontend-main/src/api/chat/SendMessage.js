import axios from 'axios';

export default async function SendMessage(formData, files) {
  const controller = new AbortController();
  const abortSignal = controller.signal;

  try {
    const form = new FormData();
    form.append('message', formData.get('message'));
    form.append('roomName', formData.get('roomName'));
    form.append('roomGroupName', formData.get('roomGroupName'));
    form.append('mood', formData.get('mood'));
    form.append('encryption', formData.get('encryption'));
    form.append('gif', formData.get('gif'));
    form.append('voice_message', formData.get('voice_message'));
    form.append('poll', formData.get('poll'));

    if (formData.has('publicKey')) {
      form.append('publicKey', formData.get('publicKey'));
    }

    // Append files
    if (files.length > 0) {
      for (let i = 0; i < files.length; i += 1) {
        form.append('files', files[i]);
      }
    }

    const res = await axios.post('/api/chat/send_message', form, {
      signal: abortSignal,
    });

    if (res.status === 200) {
      return res;
    }
  } catch (err) {
    if (axios.isCancel(err)) {
      // eslint-disable-next-line
      console.log('Request canceled', err.message);
    } else {
      // eslint-disable-next-line
      console.log(err);
    }
  }
}
