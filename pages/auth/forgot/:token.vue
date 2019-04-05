<template>
  <div class="forgot__wrap">
    <div class="container_auth">
      <div class="logo">
        <img
          src="/auth-logo.png"
          alt="Logo">
      </div>
      <div class="card-block">
        <div class="image">
          <img
            src="/auth-image.png"
            alt="Image">
        </div>
        <div class="form">
          <h1 class="welcome">Restore Password</h1>
          <p class="register">
            Don't have an account?
            <span>Try
              <nuxt-link
                :to="'/auth/register'"
                class="">
                We Work Together
              </nuxt-link>
              for Free.
            </span>
          </p>
          <input-transparent
            :label="'Email'"
            :type="'text'"
            :placeholder="'myname@email.com'"
            @update="email = $event"/>

          <input-transparent
            :label="'New password'"
            :type="'password'"
            :placeholder="'*******'"
            @update="new_password = $event"/>

          <input-transparent
            :label="'New password confirmation'"
            :type="'password'"
            :placeholder="'*******'"
            @update="password_confirmation = $event"/>

          <div class="form-group">
            <button
              class="btn btn-md btn-green rounded bold"
              @click="restore">
              <div class="content">
                Restore
                <fa
                  :icon="['fa', 'unlock']"
                  class="icon"/>
              </div>
            </button>
          </div>
          <div class="agreement">
            By using this Service you agree to our
            <a 
              href="https://softwareworksforyou.co.uk/terms-of-use/"
              target="_blank"
              class="blue">Terms of Use</a>
            and
            <a
              href="https://softwareworksforyou.co.uk/privacy-policy/"
              target="_blank"
              class="blue">Privacy Policy</a>
          </div>
          <div class="footer">
            <nuxt-link
              :to="'/auth/login'"
              class="vl">
              SignUp
            </nuxt-link>
            <a
              target="_blank"
              href="https://weworktogethersoftware.com/contact-us">Help &amp; Support</a>
          </div>
        </div>
      </div>
      <div class="footer-info">
        <div class="vat">
          Don't have an account?
          <nuxt-link
            :to="'/auth/register'"
            class="register">
            Try We Work Together for Free
          </nuxt-link>
          <span>
            All prices in Pounds Sterling, excluding VAT.
          </span>
        </div>
        <div class="trial">
          30 Day Free Trial with full access to all functions.
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import InputTransparent from '~/components/inputTransparent/inputTransparent'

export default {
  name: 'Token',
  components: { InputTransparent },
  layout: 'minimal',
  middleware: 'auth',

  data() {
    return {
      email: '',
      token: null,
      new_password: '',
      password_confirmation: ''
    }
  },
  mounted() {
    this.token = this.$route.params.token
  },
  methods: {
    restore() {
      const params = {
        email: this.email,
        token: this.token,
        password: this.new_password,
        password_confirmation: this.password_confirmation
      }
      this.$api().auth.restore(params)
    }
  }
}
</script>
<style lang="scss" scoped>
.forgot__wrap {
  box-sizing: border-box;
  padding: 40px 0;
  min-height: 100vh;
  background: linear-gradient(
    45deg,
    #072c6d,
    #072c6d 0,
    #072c6d 0,
    rgba(0, 166, 216, 0.88) 60%,
    rgba(0, 166, 216, 0.8)
  );
  text-align: center;

  a {
    color: #007fb2;
  }
  .container_auth {
    margin: 0 auto;
    max-width: 1200px;

    .logo {
      display: inline-block;
      height: 35px;
      margin-bottom: 40px;
      width: 300px;

      img {
        max-width: 100%;
        height: auto;
      }
    }
    .card-block {
      background: #fff;
      border: none;
      border-radius: 20px;
      box-shadow: 0 0 80px rgba(0, 0, 0, 0.25);
      display: inline-flex;
      overflow: hidden;
      padding: 0;
      justify-content: flex-start;
      width: 920px;

      .image {
        position: relative;
        object-fit: cover;
        width: 50%;

        &::before {
          content: '';
          background: rgba(0, 0, 0, 0.55);
          height: 100%;
          left: 0;
          position: absolute;
          top: 0;
          width: 100%;
          z-index: 2;
        }

        img {
          max-width: 100%;
          min-height: 100%;
        }
      }

      .form {
        box-sizing: border-box;
        padding: 50px 80px 50px 65px;
        text-align: left;
        width: 50%;

        .welcome {
          color: #2a313a;
          font-size: 24px;
          font-weight: 700;
          line-height: 30px;
          margin: 0;
          text-transform: uppercase;

          span {
            display: block;
          }
        }
        .register {
          color: #818e9e;
          display: block;
          font-size: 18px;
          font-weight: 400;
          line-height: 24px;
          margin: 20px 0 86px;

          span {
            display: block;
          }
        }

        .forgot {
          float: right;
          color: #818e9e;
          font-size: 14px;
          font-weight: 300;
          line-height: 24px;
          margin: 0;
          padding: 0;

          &:hover {
            text-decoration: none;
          }

          .blue {
            color: rgb(0, 151, 213);

            &:hover {
              text-decoration: none;
            }
          }
        }

        .btn {
          margin-top: 15px;

          .icon {
            margin-left: 50px;
          }
        }

        .agreement {
          color: #818e9e;
          font-size: 14px;
          font-weight: 300;
          line-height: 24px;
          margin-top: 86px;

          .blue {
            display: inline-block;

            &:hover {
              text-decoration: none;
            }
          }
        }

        .footer {
          color: #fff;
          font-size: 14px;
          font-weight: 300;
          line-height: 24px;
          margin-top: 40px;

          .vl {
            border-right: 1px solid #d4d9e1;
            margin-right: 5px;
            padding-right: 8px;
          }
        }
      }
    }

    .footer-info {
      color: #fff;
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-weight: 300;
      line-height: 24px;
      margin: 0 auto;
      margin-top: 40px;
      width: 920px;

      .vat {
        text-align: left;

        .register {
          color: #fff;
          text-decoration: underline;
        }
        span {
          display: block;
        }
      }
    }
  }
  @media (max-width: 1023px) {
    .container_auth {
      .card-block {
        width: 760px;
      }

      .footer-info {
        width: 760px;
      }
    }
  }

  @media (max-width: 767px) {
    .container_auth {
      padding: 0 10px;

      .card-block {
        width: 100%;

        .image {
          display: none;
        }

        .form {
          width: 100%;
        }
      }
      .footer-info {
        flex-wrap: wrap;
        width: 100%;

        .vat {
          text-align: center;
          width: 100%;
        }
        .trial {
          margin-top: 20px;
          width: 100%;
        }
      }
    }
  }
  @media (max-width: 544px) {
    .container_auth {
      .card-block {
        .form {
          padding: 25px 40px;
        }
      }
    }
  }
}
</style>
