import React from 'react';

function TermsOfService({ language }) {
  return (
    <div className="terms-of-service" dir={language === 'EN' ? 'ltr' : 'rtl'}>
      <div className="container">
        {language === 'EN' ? (
          <>
            <h1 className="text-center my-4">Terms of Service</h1>
            <section>
              <h3>Acceptance of Terms</h3>
              <p>
                By using our services, you agree to these Terms of Service. If you do not agree, please do not use our services.
              </p>
            </section>
            <section>
              <h3>Use of Services</h3>
              <p>
                Our services are provided for personal and commercial use only. You must not use our services for any illegal or unauthorized purpose.
              </p>
            </section>
            <section>
              <h3>Account Responsibility</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
              </p>
            </section>
            <section>
              <h3>Pricing and Payment</h3>
              <p>
                Prices for our products or services are subject to change without notice. You agree to pay all fees and applicable taxes for any purchases.
              </p>
            </section>
            <section>
              <h3>Limitation of Liability</h3>
              <p>
                We are not liable for any indirect, incidental, or consequential damages resulting from the use of our services.
              </p>
            </section>
            <section>
              <h3>Changes to Terms</h3>
              <p>
                We reserve the right to update or modify these Terms of Service at any time. Changes will be effective immediately upon posting.
              </p>
            </section>
            <footer className="text-center my-4">
              <p>
                If you have any questions about these Terms of Service, please contact us directly.
              </p>
            </footer>
          </>
        ) : (
          <>
            <h1 className="text-center my-4">شروط الخدمة</h1>
            <section>
              <h3>قبول الشروط</h3>
              <p>
                باستخدام خدماتنا، فإنك توافق على شروط الخدمة هذه. إذا كنت لا توافق، يُرجى عدم استخدام خدماتنا.
              </p>
            </section>
            <section>
              <h3>استخدام الخدمات</h3>
              <p>
                يتم تقديم خدماتنا للاستخدام الشخصي والتجاري فقط. يجب عدم استخدام خدماتنا لأي غرض غير قانوني أو غير مصرح به.
              </p>
            </section>
            <section>
              <h3>مسؤولية الحساب</h3>
              <p>
                أنت مسؤول عن الحفاظ على سرية معلومات حسابك وعن جميع الأنشطة التي تحدث ضمن حسابك.
              </p>
            </section>
            <section>
              <h3>التسعير والدفع</h3>
              <p>
                الأسعار الخاصة بمنتجاتنا أو خدماتنا عرضة للتغيير دون إشعار مسبق. أنت توافق على دفع جميع الرسوم والضرائب المطبقة على أي مشتريات.
              </p>
            </section>
            <section>
              <h3>تحديد المسؤولية</h3>
              <p>
                نحن غير مسؤولين عن أي أضرار غير مباشرة أو عرضية أو ناتجة عن استخدام خدماتنا.
              </p>
            </section>
            <section>
              <h3>تغييرات على الشروط</h3>
              <p>
                نحتفظ بالحق في تحديث أو تعديل شروط الخدمة هذه في أي وقت. ستكون التغييرات سارية فور نشرها.
              </p>
            </section>
            <footer className="text-center my-4">
              <p>
                إذا كانت لديك أي أسئلة حول شروط الخدمة هذه، يُرجى التواصل معنا مباشرة.
              </p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

export default TermsOfService;
