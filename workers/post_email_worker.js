const queue = require('../config/kue');
const postsMailer = require('../mailers/posts_mailer');

queue.process('post_email', (job,done)=>{
    console.log('emails worker is processing a job',job.data);

    postsMailer.newPost(job.data.post);
    done();
})