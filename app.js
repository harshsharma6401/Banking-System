const express = require('express')
const morgan = require('morgan');
const mongoose = require('mongoose');
const User = require('./models/users');

const app = express();
const port = process.env.PORT || 3000;

// app.listen(port);


//Connect to MongoDb

const dbURI = 'mongodb+srv://HarshSharma:Harsh@bank7654@bank.if57d.mongodb.net/Bank?retryWrites=true&w=majority';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then((result)=> app.listen(port))
.catch((err)=> console.log(err));


app.use(morgan('dev'));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended:true}));

app.get('/', (req, res) => {
     res.render('index',{title:'Home'});
 });

 app.get('/index', (req, res) => {
    res.redirect('/');
});

//  app.get('/view-users', (req, res) => {
//     res.render('view-users',{title:'Users'});
// });

app.get('/transfer-money', (req, res) => {
    res.render('transfer-money',{title:'Transfer'});
});


// app.get('/transaction-history', (req, res) => {
//     res.render('transaction-history',{title:'Transactions'});
// });

app.get('/add-user', (req, res) => {
    res.render('add-user',{title:'Add user'});
});

app.get('/Adduser', (req, res) => {
    const user = new User({
     accountNumber: '445353',
     name: 'gfvvfdd',
     email: 'mnfrbd',
     balance:'8677'
    })
  
    user.save()
      .then(result => {
        res.send(result);
      })
      .catch(err => {
        console.log(err);
      });
  });

   app.get('/view-users', (req, res) => {
      res.redirect('all-users');
  });

app.post('/view-users',(req,res)=>{

  const user = new User(req.body);

  user.save()
  .then((result)=>{
    res.redirect('/all-users');     
  })
  .catch((err)=>{
      console.log(err);
  })
  
  });

  app.post('/transfer', async (req,res)=>{

    const { sender, reciever, amount } = req.body;

    console.log(req.body);
    const sendid = sender;

    let senderUser, transferUser;
    try {
      senderUser = await User.findOne({ accountNumber: sender });
      transferUser = await User.findOne({ accountNumber: reciever });

    }
    catch (err) {
      res.render("payment-failure", { title: "Something went wrong" });
    }

    if (!senderUser || !transferUser) {
      res.render("payment-failure", { title: "No User" });
    }

    console.log('Success');

    if ( senderUser.balance < amount  ||  amount < 0 ) {
      res.render("payment-failure", { title: "Not Enough" });
    }


    senderUser.balance = senderUser.balance - Number(amount);
    transferUser.balance = transferUser.balance + Number(amount);
    let savedsenderUser, savedtransferUser;
    try {
      savedsenderUser = await senderUser.save();
      savedtransferUser = await transferUser.save();
    }
    catch (err) {
      res.render("payment-failure", { title: "Smthng2" });
    }

    res.render("payment-success", { title: "Transaction successful" });


    });

  app.get('/all-users', (req, res) => {
    User.find()
      .then(result => {
        res.render('view-users', { users: result, title: 'Users' });
      })
      .catch(err => {
        console.log(err);
      });
  });

  app.get('/transaction-history', (req, res) => {
    //  console.log(req.body);
  User.find()
  .then((result)=>{
    res.render('transaction-history', { users: result, title: 'Transactions' });     
  })
  .catch((err)=>{
      console.log(err);
  })
});

app.use((req,res)=>{
res.status(404).render('404',{title :'404'});
});