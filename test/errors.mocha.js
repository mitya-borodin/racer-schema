var assert = require('assert');
var model = require('./model');

describe('errors', function(){
  it('should return firstName error', function(done){
    var user = {
      firstName: true,
      lastName: 'Ivanov',
      age: 18
    }
    var userId = model.add('users', user, function(err) {
      assert(err);
      assert.equal(err.collection, 'users');
      assert.equal(err.docId, userId);
      assert.equal(err.errors.length, 1);
      assert.equal(err.errors[0].paths.length, 1);
      assert.equal(err.errors[0].paths[0], 'firstName');
      done();
    });
  });

  it('should return hobbies.1 error', function(done){
    var user = {
      firstName: 'Ivan',
      lastName: 'Ivanov',
      age: 18,
      hobbies: ['jazz', 4]
    }
    model.add('users', user, function(err) {
      assert(err);
      assert.equal(err.errors.length, 1);
      assert.equal(err.errors[0].paths.length, 2);
      assert.equal(err.errors[0].paths[0], 'hobbies');
      assert.strictEqual(err.errors[0].paths[1], 1);
      done();
    });
  });

  it('should return hobbies.2 error', function(done){
    var user = {
      firstName: 'Ivan',
      lastName: 'Ivanov',
      age: 18,
      hobbies: ['jazz', 'r`n`r', 'Vasya']
    }
    model.add('users', user, function(err) {
      assert(err);
      assert.equal(err.errors.length, 1);
      assert.equal(err.errors[0].paths.length, 2);
      assert.equal(err.errors[0].paths[0], 'hobbies');
      assert.strictEqual(err.errors[0].paths[1], 2);
      done();
    });
  });

  it('should return categoryHash error', function(done){
    var product = {
      categoryHash: {
        wrong: 'asdf'
      }
    }
    model.add('products', product, function(err) {
      assert(err);
      assert.equal(err.errors.length, 1);
      assert.equal(err.errors[0].paths.length, 1);
      assert.equal(err.errors[0].paths[0], 'categoryHash');
      done();
    });
  });

  it('should return wrong error', function(done){
    var product = {
      name: 'B-737'
    }
    var productId = model.add('products', product, function(err) {
      assert(!err);
      var $product = model.at('products.' + productId);
      model.fetch($product, function(err) {
        assert(!err);
        $product.set('wrong', 'value', function(err) {
          assert(err);
          assert.equal(err.errors.length, 1);
          assert.equal(err.errors[0].paths.length, 1);
          assert.equal(err.errors[0].paths[0], 'wrong');
          done();
        });
      });
    });
  });

  it('should return categories.0 error', function(done){
    var product = {
      name: 'B-2'
    }
    var productId = model.add('products', product, function(err) {
      assert(!err);
      var $product = model.at('products.' + productId);
      model.fetch($product, function(err) {
        assert(!err);
        $product.push('categories', model.id(), function(err) {
          assert(err);
          console.log(err);
          assert.equal(err.errors.length, 1);
          assert.equal(err.errors[0].paths.length, 2);
          assert.equal(err.errors[0].paths[0], 'categories');
          assert.equal(err.errors[0].paths[1], 0);
          done();
        });
      });
    });
  });

  it('should return values.value.0 error', function(done){
    var product = {
      name: 'B-2'
    }
    var productId = model.add('products', product, function(err) {
      assert(!err);
      var $product = model.at('products.' + productId);
      model.fetch($product, function(err) {
        assert(!err);
        $product.push('values.value', 'wrong', function(err) {
          assert(err);
          console.log(JSON.stringify(err), err.errors[0].message);
          assert.equal(err.errors.length, 1);
          assert.equal(err.errors[0].paths.length, 3);
          assert.equal(err.errors[0].paths[0], 'values');
          assert.equal(err.errors[0].paths[1], 'value');
          assert.equal(err.errors[0].paths[2], 0);
          done();
        });
      });
    });
  });
});
