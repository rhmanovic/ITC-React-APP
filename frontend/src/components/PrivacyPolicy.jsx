import React from 'react';

function PrivacyPolicy({ language }) {
  return (
    <div className="privacy-policy" dir={language === 'EN' ? 'ltr' : 'rtl'}>
      <div className="container">
        {language === 'EN' ? (
          <>
            <h1 className="text-center my-4">Privacy Policy</h1>
            <section>
              <h3>Introduction</h3>
              <p>
                We value your privacy and are committed to protecting your personal information.
                This Privacy Policy outlines how we collect, use, and safeguard your data.
              </p>
            </section>
            <section>
              <h3>Information We Collect</h3>
              <p>
                We may collect your name, email address, phone number, payment details, and other
                relevant information necessary for providing our services.
              </p>
            </section>
            <section>
              <h3>How We Use Your Data</h3>
              <p>
                Your information is used to fulfill orders, improve our services, and communicate
                with you about updates, offers, or issues related to our services.
              </p>
            </section>
            <section>
              <h3>Sharing Information with Third Parties</h3>
              <p>
                We may share your information with trusted third-party service providers for
                payment processing, delivery, or other operational purposes.
              </p>
            </section>
            <section>
              <h3>Data Security</h3>
              <p>
                We implement strict security measures to protect your personal information against
                unauthorized access, disclosure, or loss.
              </p>
            </section>
            <section>
              <h3>Your Rights</h3>
              <p>
                You have the right to access, update, or delete your personal information and can
                request this through our customer service team.
              </p>
            </section>
            <footer className="text-center my-4">
              <p>
                For any questions or concerns about our Privacy Policy, please contact us directly.
              </p>
            </footer>
          </>
        ) : (
          <>
            <h1 className="text-center my-4">سياسة الخصوصية</h1>
            <section>
              <h3>مقدمة</h3>
              <p>
                نحن نقدر خصوصيتك وملتزمون بحماية معلوماتك الشخصية. تسلط هذه السياسة الضوء على كيفية جمعنا واستخدامنا وحماية بياناتك.
              </p>
            </section>
            <section>
              <h3>المعلومات التي نجمعها</h3>
              <p>
                قد نقوم بجمع اسمك وعنوان بريدك الإلكتروني ورقم هاتفك وتفاصيل الدفع ومعلومات أخرى ضرورية لتقديم خدماتنا.
              </p>
            </section>
            <section>
              <h3>كيف نستخدم بياناتك</h3>
              <p>
                تُستخدم معلوماتك لتلبية الطلبات، وتحسين خدماتنا، والتواصل معك بشأن التحديثات والعروض أو أي مشكلات تتعلق بخدماتنا.
              </p>
            </section>
            <section>
              <h3>مشاركة المعلومات مع أطراف ثالثة</h3>
              <p>
                قد نشارك معلوماتك مع مزودي خدمات خارجيين موثوق بهم لمعالجة الدفع أو التوصيل أو أغراض تشغيلية أخرى.
              </p>
            </section>
            <section>
              <h3>أمان البيانات</h3>
              <p>
                نتبع تدابير أمان صارمة لحماية معلوماتك الشخصية من الوصول غير المصرح به أو الكشف أو الفقدان.
              </p>
            </section>
            <section>
              <h3>حقوقك</h3>
              <p>
                لديك الحق في الوصول إلى معلوماتك الشخصية أو تحديثها أو حذفها، ويمكنك طلب ذلك عبر فريق خدمة العملاء لدينا.
              </p>
            </section>
            <footer className="text-center my-4">
              <p>إذا كانت لديك أي أسئلة أو استفسارات حول سياسة الخصوصية الخاصة بنا، يرجى التواصل معنا مباشرة.</p>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}

export default PrivacyPolicy;
