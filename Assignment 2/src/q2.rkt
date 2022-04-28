#lang racket

;;Signature:
;;Type:
;; Purpose: 
;; Pre-condition: 
;; Tests:
(define append 
  (lambda(lst1 lst2)
      (if (eq? lst1 '()) 
      lst2
      (cons (car lst1) 
            (append(cdr lst1) lst2))))
  )
;;(append '(1 2) '(3 4))


;;Signature:
;;Type:
;; Purpose: 
;; Pre-condition: 
;; Tests:
(define reverse 
  (lambda (lst)
        (if (eq? lst '())
     null
     (append (reverse (cdr lst)) (list (car lst)))
  )
  )
)
;;(reverse '(1 2 3))


;;Signature:
;;Type:
;; Purpose: 
;; Pre-condition: 
;; Tests:
(define dup
  (lambda (lst num2)
    (if (eq? num2 0)
        '()
    (if (eq? num2 1)
        lst
        (dup (append (list(car lst)) lst) (- num2 1))))))

(define duplicate-items
   (lambda(lst dup-count)
      (if (eq? lst '())
          lst
          (append (dup (list(car lst)) (car dup-count)) (duplicate-items (cdr lst) (append (cdr dup-count) (list(car dup-count))))))
     )
  )

;;Signature: payment(n coins-lst)
;;Type: [number*[List(T1) ; List(T1) ]
;; Purpose: 
;; Pre-condition: none
;; Tests:(payment 10 ‘(5 5 10)) → 2)
(define payment
  (lambda (sum coins-lst)
    (paymentHelp sum (counter coins-lst))))

(define paymentHelp
  (lambda (sum coins-lst)
    (if(< sum 0)
       0
     (if(= sum 0)
       1
     (if(eq? coins-lst '())
        0
     (if(eq? (caar coins-lst) 0)
        (paymentHelp sum (cdr coins-lst))
     (+ (paymentHelp (- sum (cdar coins-lst)) (decrese coins-lst)) (paymentHelp sum (cdr coins-lst)))))))
    )
  )

(define counter
    (lambda (lst) 
        (if (eq? lst '())
         '()
        (cons (cons (countHelp (car lst) lst) (car lst))
              (counter (delete (car lst) lst))))
    )
)

(define countHelp
  (lambda(x lst)
        (if(eq? lst '())
           0
        (if(eq? x (car lst))
           (+ 1 (countHelp x (cdr lst)))
        (countHelp x (cdr lst))))
    )
  )

(define delete
  (lambda (item list)
    (if(eq? list '())
       '()
     (if(eq? item (car list))
        (delete item (cdr list))
     (cons (car list) (delete item (cdr list)))))
    )
  )

(define decrese
  (lambda (coins-list)
    (cons (cons (- (caar coins-list) 1) (cdar coins-list)) (cdr coins-list))))    


(payment 10 '( 5 5 10))
(payment 5 '( 1 1 1 2 2 5 10))


;;Signature:
;;Type:
;; Purpose: 
;; Pre-condition: 
;; Tests:
(define compose-n
  (lambda (f n)
  (if (= n 1)
      f
      (lambda (x) (f ((compose-n f (- n 1)) x)))
      )
    )
  )

(define mul8 (compose-n (lambda (x) (* 2 x)) 3))
(mul8 3) 