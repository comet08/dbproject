module.exports = function(app) {
     app.get('/', function(req, res){ 
          res.render('index.html'); }
          );
     app.get('/m1.html', function(req, res){ 
         res.render('m1.html'); }
          );
    app.get('/login.html', function(req, res){ 
        res.render('login.html'); }
    );
    app.get('/reg.html', function(req, res){ 
        res.render('reg.html'); }
    );
    app.get('/index.html', function(req, res){ 
        res.render('index.html'); }
    );
    app.get('/1-2.html', function(req, res){ 
        res.render('1-2.html'); }
    );  
    app.get('/1-3.html', function(req, res){ 
        res.render('1-3.html'); }
    );  
    app.get('/m2.html', function(req, res){ 
        res.render('m2.html'); }
    );  
    app.get('/m4.html', function(req, res){ 
        res.render('m4.html'); }
    );
    app.get('/m3.html', function(req, res){ 
        res.render('m3.html'); }
    );
    app.get('/4-2.html', function(req, res){ 
        res.render('4-2.html'); }
    )  ;
    app.get('/4-3.html', function(req, res){ 
        res.render('4-3.html'); }
    ) ;
    app.get('/4-4.html', function(req, res){ 
        res.render('4-4.html'); }
    ) ;

    app.get('/admin.html', function(req, res){ 
        res.render('admin.html'); }
    ) ;

    app.get('/adminindex.html', function(req, res){ 
        res.render('adminindex.html'); }
    ) ;

    app.get('/adminm1.html', function(req, res){ 
        res.render('adminm1.html'); }
    ) ;
    app.get('/adminm4.html', function(req, res){ 
        res.render('adminm4.html'); }
    ) ;

    app.get('/adminm2.html', function(req, res){ 
        res.render('adminm2.html'); }
    ) ;
    app.get('/adminm3.html', function(req, res){ 
        res.render('adminm3.html'); }
    ) ;

}
