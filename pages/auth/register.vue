<template>
  <div class="register__wrap">
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
          <div class="preview">
            <div class="block">
              <div class="title">
                IT'S SIMPLE TO GET STARTED
              </div>
              <ul class="list">
                <li>Free to sign up & try</li>
                <li>Only pay when you're ready</li>
                <li>Cancel at any time</li>
              </ul>
            </div>
            <div class="block">
              <div class="text">WHAT PEOPLE ARE SAYING:</div>
              <blockquote>
                "Having used off the shelf software for creating gas certificates since 2008 , I can honestly say this package has everything required for any forward thinking gas service engineer"
              </blockquote>
              <div class="author">Steve Jamison - <span>Gas Check Plus</span></div>
            </div>
          </div>
        </div>
        <form class="form">
          <h1 class="welcome">TRY WE WORK <span>TOGETHER SOFTWARE</span></h1>
          <p class="register">
            30 Day Free Trial, no payment details required.
          </p>
          <input-transparent
            :label="'Email'"
            :type="'text'"
            @update="email = $event"/>

          <input-transparent
            :label="'Password'"
            :type="'password'"
            @update="password = $event"/>

          <input-transparent
            :label="'Password confirmation'"
            :type="'password'"
            @update="password_confirmation = $event"/>

          <div class="form-group">
            <button
              class="btn btn-md btn-green rounded bold"
              @click.prevent="register">
              <div class="content">
                GET STARTED
                <fa
                  :icon="['fa', 'angle-right']"
                  class="icon"/>
              </div>
            </button>
          </div>
          <div class="footer">
            <nuxt-link
              :to="'/auth/login'"
              class="vl">
              Log In
            </nuxt-link>
            <a
              target="_blank"
              href="https://weworktogethersoftware.com/contact-us">Help &amp; Support</a>
          </div>
        </form>
      </div>
      <div class="footer-info">
        <div class="vat">
          Don't have an account?
          <nuxt-link
            :to="'/auth/register'"
            class="register">
            Try We Work Together for Free.
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
import { mapMutations } from 'vuex'
export default {
  name: 'Register',
  components: { InputTransparent },
  layout: 'minimal',
  middleware: 'auth',

  data() {
    return {
      email: '',
      password: '',
      password_confirmation: ''
    }
  },

  methods: {
    ...mapMutations({ setToken: 'token/setToken' }),
    register() {
      this.$api()
        .auth.register({
          email: this.email,
          password: this.password,
          password_confirmation: this.password_confirmation
        })
        .then(res => {
          if (res && res.accessToken) {
            this.setToken(res.accessToken)
            this.$router.push('/')
          }
        })
        .catch(err => {
          console.log('Error detected, please contact the administrator')
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.register__wrap {
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
          background: rgba(0, 0, 0, 0.8);
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

        .preview {
          box-sizing: border-box;
          color: #fff;
          display: flex;
          flex-direction: column;
          height: 100%;
          left: 0;
          position: absolute;
          padding: 50px 80px;
          text-align: left;
          top: 0;
          justify-content: space-between;
          z-index: 3;

          .title {
            font-size: 24px;
            font-weight: 700;
            line-height: 30px;
            text-transform: uppercase;
          }

          .list {
            list-style: none;
            padding: 0;
            margin: 28px 0 0 0;

            li {
              font-size: 18px;
              font-weight: 500;
              line-height: 24px;
              margin-bottom: 7px;
              position: relative;
              padding-left: 35px;

              &:last-child {
                margin-bottom: 0;
              }

              &::before {
                content: '';
                background: url('/mark.png') center no-repeat;
                height: 22px;
                position: absolute;
                left: 0;
                top: 50%;
                transform: translateY(-50%);
                width: 22px;
              }
            }
          }

          .text {
            display: block;
            font-size: 16px;
            font-weight: 500;
            line-height: 24px;
            text-transform: uppercase;
          }

          blockquote {
            margin-top: 10px;
            font-size: 14px;
            font-weight: 400;
            font-style: italic;
            line-height: 24px;
            display: block;
          }

          .author {
            font-weight: bold;

            span {
              font-weight: normal;
            }
          }
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
        flex-wrap: wrap;
        width: 544px;

        .image {
          height: 460px;
          overflow: hidden;
          width: 100%;

          img {
            min-height: auto;
          }

          .preview {
            .block {
              &:last-child {
                margin-top: 50px;
              }
            }
          }
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
        width: 100%;

        .image {
          height: 590px;

          img {
            min-height: 100%;
          }

          .preview {
            padding: 25px 40px;
          }
        }

        .form {
          padding: 25px 40px;
        }
      }
    }
  }
}
</style>
